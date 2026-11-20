UPDATE public.job_roles
SET pay = 'Competitive',
    hours = 'Competitive — flexible shift patterns',
    perks = ARRAY['Competitive benefits package']
WHERE pay LIKE '%PLACEHOLDER%'
   OR hours LIKE '%PLACEHOLDER%'
   OR EXISTS (SELECT 1 FROM unnest(perks) AS p WHERE p LIKE '%PLACEHOLDER%');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.job_roles'::regclass
      AND conname = 'job_roles_no_placeholder_copy'
  ) THEN
    ALTER TABLE public.job_roles ADD CONSTRAINT job_roles_no_placeholder_copy CHECK (
      pay NOT LIKE '%PLACEHOLDER%'
      AND hours NOT LIKE '%PLACEHOLDER%'
      AND array_to_string(perks, ' ') NOT LIKE '%PLACEHOLDER%'
    );
  END IF;
END;
$$;