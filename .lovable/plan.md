# Kareem's missing password email: findings (read-only, nothing changed)

## 1. Sign-in service logs for reset requests, 12:00–13:30 UTC
- The log search tool returned no rows for that window, even with a wide-open query, so I can't list every request.
- One reset request did show up in the snapshot I was given:
  `POST /recover` → **status 200**, 2026-11-20 13:17:05 UTC, referer `https://blkcab.com/careers/admin/set-password`, no error message.
- The log doesn't say which email it was for. The 200 status rules out a 429 rate-limit error for that request. No `over_email_send_rate_limit` or hook errors appeared.
- Database: `hr@blkcab.com` has recovery_sent_at = 12:29:49 UTC. `kareem@blkcabcoffee.com` has recovery_sent_at = NULL (account exists, confirmed, admin).

## 2. Email sending function logs
- No invocations and no errors in the current window. The only entries are an earlier boot and shutdown. So no reset email for Kareem ever reached the sending step.

## 3. Lovable Emails send log (today)
- 12:29:51 UTC: sent to hr@blkcab.com, from notify.blkcab.com
- 09:08:05 UTC: sent to careers@blkcab.com (the earlier team-alert test)
- Nothing for either Kareem address: no sent, rejected, suppressed or rate-limited entry.

## 4. Rate limit and suppression
- Hourly auth-email limit: I can't read this with my tools. It's under More → Users → Auth settings → Email → Advanced. The 200 status above suggests the limit wasn't hit.
- Suppression: kareem@blkcabcoffee.com is **not suppressed**. I checked the global list and the blkcab.com list. The sender domain notify.blkcab.com is Active.

## 5. Conclusion
- Most likely, the reset request never reached the sign-in service for kareem@blkcabcoffee.com. The 13:17 request with a 200 status fits kareem@blkcab.com: for an address with no account, the service returns 200 and silently sends nothing.
- If kareem@blkcabcoffee.com had been processed, recovery_sent_at would be set and the sending function would show a run. Neither happened.
- Contributing issue: the reset form ignores the error the sign-in service returns, so a typo, a 429 or a network failure all still show the same neutral message. Kareem got no sign that it failed.

## Recommended fix (not applied)
1. Kareem retries once from https://blkcab.com/careers/admin → "Set or reset your password", typing exactly `kareem@blkcabcoffee.com`. Then check recovery_sent_at and the send log.
2. Small code change: keep the neutral message, but log the service's returned error to the console and show a generic "Something went wrong, try again in a minute" for rate-limit or network errors. Unknown emails would still look the same, so no account information leaks.
3. If a retry shows a 429, raise the hourly auth-email limit (sending is active, so this is allowed).
