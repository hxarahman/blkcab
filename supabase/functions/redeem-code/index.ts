import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3.23.8'

const BodySchema = z.object({
  code: z.string().trim().min(4).max(20),
  staff_pin: z.string().trim().regex(/^\d{4}$/),
  location: z.string().trim().max(80).optional().default(''),
  action: z.enum(['check', 'redeem']).optional().default('check'),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return json({ status: 'error', error: 'Invalid input' }, 400)
    }
    const { code, staff_pin, location, action } = parsed.data

    const expectedPin = Deno.env.get('STAFF_REDEEM_PIN')
    if (!expectedPin) {
      console.error('STAFF_REDEEM_PIN is not configured')
      return json({ status: 'error', error: 'Redemption not configured' }, 500)
    }
    if (staff_pin !== expectedPin) {
      return json({ status: 'invalid_pin' })
    }

    // Case-insensitive, tolerant of missing dashes / stray spaces
    const raw = code.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const normalized =
      raw.length === 10 && raw.startsWith('BC')
        ? `BC-${raw.slice(2, 6)}-${raw.slice(6, 10)}`
        : code.toUpperCase().trim()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: reward, error: findErr } = await supabase
      .from('reward_codes')
      .select('id, code, rank_name, reward_label, expires_at, redeemed_at, redeemed_location')
      .eq('code', normalized)
      .maybeSingle()
    if (findErr) throw findErr

    if (!reward) {
      return json({ status: 'not_found' })
    }
    if (reward.redeemed_at) {
      return json({
        status: 'already_redeemed',
        redeemed_at: reward.redeemed_at,
        redeemed_location: reward.redeemed_location,
        rank_name: reward.rank_name,
        reward_label: reward.reward_label,
      })
    }
    if (new Date(reward.expires_at) < new Date()) {
      return json({
        status: 'expired',
        expires_at: reward.expires_at,
        rank_name: reward.rank_name,
        reward_label: reward.reward_label,
      })
    }

    if (action === 'check') {
      return json({
        status: 'valid',
        rank_name: reward.rank_name,
        reward_label: reward.reward_label,
        expires_at: reward.expires_at,
      })
    }

    // action === 'redeem' — burn the code (idempotent: only if still unredeemed)
    const redeemedAt = new Date().toISOString()
    const { data: burned, error: burnErr } = await supabase
      .from('reward_codes')
      .update({ redeemed_at: redeemedAt, redeemed_location: location || null })
      .eq('id', reward.id)
      .is('redeemed_at', null)
      .select('id')
      .maybeSingle()
    if (burnErr) throw burnErr

    if (!burned) {
      // Raced with another redemption
      return json({ status: 'already_redeemed', redeemed_at: redeemedAt, rank_name: reward.rank_name, reward_label: reward.reward_label })
    }

    return json({
      status: 'redeemed',
      redeemed_at: redeemedAt,
      rank_name: reward.rank_name,
      reward_label: reward.reward_label,
    })
  } catch (err) {
    console.error('redeem-code error:', err)
    return json({ status: 'error', error: 'Something went wrong' }, 500)
  }
})
