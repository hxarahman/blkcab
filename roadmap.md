# Roadmap

- [x] Replace draft careers pay, hours, and perks placeholders with final copy and defaults
- [x] Confirm `tmp/browser/v/pages.py` is not in the repository
- [x] Verify the careers migration chain creates the required data and backfills role copy on acceptance
- [ ] Provision private `cvs` storage in the live app when the draft is accepted; draft storage does not carry over with these migrations
- [x] Publish the site with the corrected contact email (info@blkcab.com)
- [ ] Owner: replace GA4 placeholder `G-XXXXXXXXXX` in index.html with the real measurement ID
- [ ] Owner: fill in real opening hours in the Locations JSON-LD placeholder constant
- [ ] Open: public leaderboard (`game_scores`) is readable by anyone — owner chose to leave it; fix only on request
- [x] Create and verify the seven live Careers admins without passwords or emails; disable public signup and confirm the three domains can receive recovery redirects
- [ ] Publish the Careers admin password setup and reset screens
