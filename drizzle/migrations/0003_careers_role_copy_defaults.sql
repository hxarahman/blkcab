ALTER TABLE public.job_roles
  ALTER COLUMN pay SET DEFAULT 'Competitive',
  ALTER COLUMN hours SET DEFAULT 'Competitive — flexible shift patterns',
  ALTER COLUMN perks SET DEFAULT ARRAY['Competitive benefits package']::text[];