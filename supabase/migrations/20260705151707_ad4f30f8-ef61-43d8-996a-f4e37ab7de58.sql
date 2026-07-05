-- 1) PLAYERS
CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  email text NOT NULL UNIQUE CHECK (char_length(email) <= 255),
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.players TO anon, authenticated;
GRANT ALL ON public.players TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Anyone may sign up their email; nobody can read emails from the client
CREATE POLICY "Anyone can join the mailing list"
ON public.players FOR INSERT
TO anon, authenticated
WITH CHECK (
  email = lower(email)
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- Normalize emails to lowercase on write
CREATE OR REPLACE FUNCTION public.normalize_player_email()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.email = lower(trim(NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER normalize_player_email_trg
BEFORE INSERT OR UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.normalize_player_email();

-- 2) GAME SCORES (leaderboard)
CREATE TABLE public.game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES public.players(id) ON DELETE SET NULL,
  initials text NOT NULL CHECK (initials ~ '^[A-Z]{3}$'),
  score integer NOT NULL CHECK (score >= 0 AND score <= 100000),
  rank_name text NOT NULL CHECK (char_length(rank_name) <= 40),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.game_scores TO anon, authenticated;
GRANT ALL ON public.game_scores TO service_role;

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is public"
ON public.game_scores FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can submit a score"
ON public.game_scores FOR INSERT
TO anon, authenticated
WITH CHECK (player_id IS NULL);

CREATE INDEX game_scores_score_idx ON public.game_scores (score DESC);

-- 3) REWARD CODES (service role only — issued/redeemed via edge functions)
CREATE TABLE public.reward_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  rank_name text NOT NULL,
  reward_label text NOT NULL,
  score integer NOT NULL,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  redeemed_at timestamptz,
  redeemed_location text
);

GRANT ALL ON public.reward_codes TO service_role;

ALTER TABLE public.reward_codes ENABLE ROW LEVEL SECURITY;
-- No policies: only service role (edge functions) can touch reward codes

CREATE INDEX reward_codes_player_idx ON public.reward_codes (player_id);