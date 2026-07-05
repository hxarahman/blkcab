import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3.23.8'

// Reward tiers — server-side source of truth. Must match game ranks.
const REWARDS: Record<string, { label: string; minScore: number }> = {
  'House Regular': { label: 'Free sticker pack', minScore: 600 },
  'Cabbie': { label: 'Free upsize', minScore: 1000 },
  'Cult Driver': { label: 'Free drink', minScore: 1600 },
  'BC Insider': { label: 'Free drink + sticker pack', minScore: 2500 },
}

const BodySchema = z.object({
  first_name: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  score: z.number().int().min(0).max(100000),
  rank_name: z.string().trim().max(40),
  marketing_opt_in: z.boolean(),
})

// No ambiguous chars: 0/O/1/I removed
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length])
  return `BC-${chars.slice(0, 4).join('')}-${chars.slice(4).join('')}`
}

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
      return json({ error: 'Invalid input' }, 400)
    }
    const { first_name, email, score, rank_name, marketing_opt_in } = parsed.data
    const normalizedEmail = email.toLowerCase()

    // Server-side eligibility re-check
    const reward = REWARDS[rank_name]
    if (!reward || score < reward.minScore) {
      return json({ error: 'Rank does not qualify for a reward' }, 403)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Upsert player by email
    const { data: existingPlayer, error: findErr } = await supabase
      .from('players')
      .select('id, marketing_opt_in')
      .eq('email', normalizedEmail)
      .maybeSingle()
    if (findErr) throw findErr

    let playerId: string
    if (existingPlayer) {
      playerId = existingPlayer.id
      const updates: Record<string, unknown> = { first_name }
      // Never un-set an existing opt-in
      if (marketing_opt_in && !existingPlayer.marketing_opt_in) updates.marketing_opt_in = true
      await supabase.from('players').update(updates).eq('id', playerId)
    } else {
      const { data: created, error: insErr } = await supabase
        .from('players')
        .insert({ first_name, email: normalizedEmail, marketing_opt_in })
        .select('id')
        .single()
      if (insErr) throw insErr
      playerId = created.id
    }

    // One active (unredeemed, unexpired) code per email
    const { data: activeCode, error: activeErr } = await supabase
      .from('reward_codes')
      .select('code, rank_name, reward_label, expires_at')
      .eq('player_id', playerId)
      .is('redeemed_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('issued_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (activeErr) throw activeErr

    if (activeCode) {
      return json({
        code: activeCode.code,
        reward_label: activeCode.reward_label,
        rank_name: activeCode.rank_name,
        expires_at: activeCode.expires_at,
        existing: true,
      })
    }

    // Mint a unique single-use code
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    let code = ''
    let inserted = false
    for (let attempt = 0; attempt < 6 && !inserted; attempt++) {
      code = generateCode()
      const { error: mintErr } = await supabase.from('reward_codes').insert({
        code,
        rank_name,
        reward_label: reward.label,
        score,
        player_id: playerId,
        expires_at: expiresAt,
      })
      if (!mintErr) {
        inserted = true
      } else if (mintErr.code !== '23505') {
        throw mintErr
      }
    }
    if (!inserted) throw new Error('Could not generate a unique code')

    return json({
      code,
      reward_label: reward.label,
      rank_name,
      expires_at: expiresAt,
      existing: false,
    })
  } catch (err) {
    console.error('issue-reward error:', err)
    return json({ error: 'Could not issue code' }, 500)
  }
})
