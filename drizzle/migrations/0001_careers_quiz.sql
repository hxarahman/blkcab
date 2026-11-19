CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  level text NOT NULL CHECK (level IN ('basic','advanced','free_text')),
  applies_to text[] NOT NULL DEFAULT '{}',
  required_for text[],
  prompt text NOT NULL,
  options jsonb,
  required boolean DEFAULT true,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now());
COMMENT ON COLUMN public.quiz_questions.required_for IS 'Role slugs where the question is required; NULL = use required flag for all roles';
GRANT SELECT ON public.quiz_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active questions" ON public.quiz_questions FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert questions" ON public.quiz_questions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update questions" ON public.quiz_questions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete questions" ON public.quiz_questions FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quiz_answer_keys (
  question_id uuid PRIMARY KEY REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  correct_key text NOT NULL);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_answer_keys TO authenticated;
GRANT ALL ON public.quiz_answer_keys TO service_role;
ALTER TABLE public.quiz_answer_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins all keys" ON public.quiz_answer_keys FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.application_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.quiz_questions(id) ON DELETE SET NULL,
  answer_key text, answer_text text, is_correct boolean,
  created_at timestamptz DEFAULT now());
GRANT SELECT, DELETE ON public.application_answers TO authenticated;
GRANT ALL ON public.application_answers TO service_role;
ALTER TABLE public.application_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read answers" ON public.application_answers FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete answers" ON public.application_answers FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.job_applications ADD COLUMN quiz_correct int, ADD COLUMN quiz_total int, ADD COLUMN quiz_score_pct int CHECK (quiz_score_pct BETWEEN 0 AND 100);

CREATE OR REPLACE FUNCTION public.submit_application(payload jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id uuid := gen_random_uuid();
  v_role public.job_roles%ROWTYPE;
  v_slug text := 'general';
  v_answers jsonb := COALESCE(payload->'answers', '[]'::jsonb);
  q record; a jsonb; v_key text; v_text text; v_correct text; v_ok boolean;
  n_correct int := 0; n_total int := 0;
BEGIN
  IF COALESCE((payload->>'gdpr_consent')::boolean, false) IS NOT TRUE THEN RAISE EXCEPTION 'Consent required'; END IF;
  IF length(trim(COALESCE(payload->>'full_name',''))) = 0 OR length(payload->>'full_name') > 120 THEN RAISE EXCEPTION 'Name required'; END IF;
  IF COALESCE(payload->>'email','') !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(payload->>'email') > 255 THEN RAISE EXCEPTION 'Valid email required'; END IF;
  IF length(trim(COALESCE(payload->>'phone',''))) < 6 THEN RAISE EXCEPTION 'Phone required'; END IF;
  IF payload->>'right_to_work_uk' IS NULL THEN RAISE EXCEPTION 'Right to work required'; END IF;
  IF length(COALESCE(payload->>'availability','')) = 0 THEN RAISE EXCEPTION 'Availability required'; END IF;
  IF length(COALESCE(payload->>'cv_path','')) = 0 THEN RAISE EXCEPTION 'CV required'; END IF;
  IF length(COALESCE(payload->>'about','')) > 3000 THEN RAISE EXCEPTION 'About too long'; END IF;

  IF NULLIF(payload->>'role_id','') IS NOT NULL THEN
    SELECT * INTO v_role FROM public.job_roles WHERE id = (payload->>'role_id')::uuid AND is_open = true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Role not available'; END IF;
    v_slug := v_role.slug;
  END IF;

  INSERT INTO public.job_applications (id, role_id, role_title, full_name, email, phone, location, right_to_work_uk, availability, about, cv_path, gdpr_consent, consent_at, status)
  VALUES (v_id, v_role.id, COALESCE(v_role.title, 'General application'), trim(payload->>'full_name'), lower(trim(payload->>'email')), trim(payload->>'phone'), 'London',
    (payload->>'right_to_work_uk')::boolean, left(payload->>'availability', 200), NULLIF(payload->>'about',''), payload->>'cv_path', true, now(), 'new');

  FOR q IN SELECT * FROM public.quiz_questions WHERE is_active AND v_slug = ANY(applies_to) LOOP
    SELECT x INTO a FROM jsonb_array_elements(v_answers) x WHERE x->>'question_id' = q.id::text LIMIT 1;
    v_key := NULLIF(a->>'answer_key',''); v_text := NULLIF(left(trim(COALESCE(a->>'answer_text','')), 3000),'');
    IF (CASE WHEN q.required_for IS NOT NULL THEN v_slug = ANY(q.required_for) ELSE COALESCE(q.required,true) END)
       AND ((q.level = 'free_text' AND v_text IS NULL) OR (q.level <> 'free_text' AND v_key IS NULL)) THEN
      RAISE EXCEPTION 'Please answer question %', q.code;
    END IF;
    v_ok := NULL;
    IF q.level <> 'free_text' THEN
      SELECT correct_key INTO v_correct FROM public.quiz_answer_keys WHERE question_id = q.id;
      IF v_correct IS NOT NULL THEN
        n_total := n_total + 1;
        v_ok := (v_key IS NOT NULL AND v_key = v_correct);
        IF v_ok THEN n_correct := n_correct + 1; END IF;
      END IF;
      v_text := NULL;
    ELSE
      v_key := NULL;
    END IF;
    IF v_key IS NOT NULL OR v_text IS NOT NULL OR v_ok IS NOT NULL THEN
      INSERT INTO public.application_answers (application_id, question_id, answer_key, answer_text, is_correct) VALUES (v_id, q.id, v_key, v_text, v_ok);
    END IF;
  END LOOP;

  UPDATE public.job_applications SET quiz_correct = n_correct, quiz_total = n_total,
    quiz_score_pct = CASE WHEN n_total > 0 THEN round(100.0 * n_correct / n_total) ELSE NULL END WHERE id = v_id;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO anon, authenticated;

DROP POLICY "Anyone can apply" ON public.job_applications;
REVOKE INSERT ON public.job_applications FROM anon;
REVOKE INSERT ON public.job_applications FROM authenticated;

WITH qs(code, level, applies_to, required_for, required, prompt, options, sort_order, correct) AS (VALUES
 ('B1','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL::text[],true,'What is a typical brew ratio (dose : yield) for a standard modern espresso?','[{"key":"a","label":"1:1"},{"key":"b","label":"1:2"},{"key":"c","label":"1:5"},{"key":"d","label":"1:10"}]'::jsonb,1,'b'),
 ('B2','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'Roughly how long should a standard espresso shot take to extract?','[{"key":"a","label":"5–10 seconds"},{"key":"b","label":"25–30 seconds"},{"key":"c","label":"45–60 seconds"},{"key":"d","label":"Over 90 seconds"}]',2,'b'),
 ('B3','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'What is the ideal temperature range for steaming milk for most milk drinks?','[{"key":"a","label":"30–40°C"},{"key":"b","label":"55–65°C"},{"key":"c","label":"75–85°C"},{"key":"d","label":"95°C or hotter"}]',3,'b'),
 ('B4','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'A shot runs very fast and tastes sour and thin. What is the most likely cause and fix?','[{"key":"a","label":"Over-extracted — grind coarser"},{"key":"b","label":"Under-extracted — grind finer"},{"key":"c","label":"Under-extracted — grind coarser"},{"key":"d","label":"The milk is too hot"}]',4,'b'),
 ('B5','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'A shot runs very slowly and tastes harsh and bitter. What should you adjust first?','[{"key":"a","label":"Grind coarser"},{"key":"b","label":"Grind finer"},{"key":"c","label":"Increase the dose"},{"key":"d","label":"Use colder water"}]',5,'a'),
 ('B6','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'Which statement about Arabica and Robusta is correct?','[{"key":"a","label":"Robusta has more caffeine and is usually more bitter; Arabica is usually sweeter and more complex"},{"key":"b","label":"Arabica has more caffeine than Robusta"},{"key":"c","label":"They are the same plant roasted differently"},{"key":"d","label":"Robusta is only used for decaf"}]',6,'a'),
 ('B7','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'What does "single origin" mean?','[{"key":"a","label":"Coffee from one country, region or farm"},{"key":"b","label":"Coffee roasted to a single roast level"},{"key":"c","label":"Coffee made with one brew method"},{"key":"d","label":"A blend from a single roaster"}]',7,'a'),
 ('B8','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'How often should espresso group heads be backflushed with machine detergent?','[{"key":"a","label":"Once a month"},{"key":"b","label":"At the end of every day (with water flushes during service)"},{"key":"c","label":"Only when the machine breaks"},{"key":"d","label":"Once a year at service"}]',8,'b'),
 ('B9','basic',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'Put these in order from LEAST to MOST milk: latte, flat white, cortado.','[{"key":"a","label":"Latte, flat white, cortado"},{"key":"b","label":"Cortado, flat white, latte"},{"key":"c","label":"Flat white, cortado, latte"},{"key":"d","label":"They all use the same amount"}]',9,'b'),
 ('A1','advanced',ARRAY['senior-barista','head-barista','shift-lead-barista','store-manager'],NULL,true,'You open with a new espresso. What is the best way to dial it in?','[{"key":"a","label":"Fix the dose and recipe, pull a shot, check yield/time, taste, then adjust grind one variable at a time"},{"key":"b","label":"Change dose, grind and temperature all at once to save time"},{"key":"c","label":"Use yesterday''s settings without tasting"},{"key":"d","label":"Adjust the milk temperature until it tastes right"}]',10,'a'),
 ('A2','advanced',ARRAY['senior-barista','head-barista','shift-lead-barista','store-manager'],NULL,true,'Measured with a refractometer, what extraction yield (EY) range do most specialty espressos target?','[{"key":"a","label":"5–10%"},{"key":"b","label":"18–22%"},{"key":"c","label":"30–35%"},{"key":"d","label":"Over 50%"}]',11,'b'),
 ('A3','advanced',ARRAY['senior-barista','head-barista','shift-lead-barista','store-manager'],NULL,true,'During a busy morning your shots gradually start running slower as the grinder warms up. What do you do?','[{"key":"a","label":"Nothing — it will settle"},{"key":"b","label":"Make small coarser adjustments and re-check dose, yield and time regularly"},{"key":"c","label":"Increase the dose to compensate"},{"key":"d","label":"Switch to pre-ground coffee"}]',12,'b'),
 ('A4','advanced',ARRAY['senior-barista','head-barista','shift-lead-barista','store-manager'],NULL,true,'What is the best approach to milk and perishable stock control?','[{"key":"a","label":"Order extra so you never run out"},{"key":"b","label":"First-in-first-out rotation, date labels, a daily waste log and par levels based on sales"},{"key":"c","label":"Check stock once a month"},{"key":"d","label":"Let each barista order what they think is needed"}]',13,'b'),
 ('A5','advanced',ARRAY['senior-barista','head-barista','shift-lead-barista','store-manager'],NULL,true,'The queue is 15 people deep and one team member has called in sick. What do you do first?','[{"key":"a","label":"Keep everyone doing whatever they were doing"},{"key":"b","label":"Assign clear positions (till, bar, milk/runner), keep the queue informed of wait times and keep standards consistent"},{"key":"c","label":"Stop taking orders until the queue clears"},{"key":"d","label":"Make every drink yourself"}]',14,'b'),
 ('F1','free_text',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],ARRAY['barista','senior-barista','head-barista','shift-lead-barista','store-manager'],false,'Describe how you would dial in a new espresso at the start of the day.',NULL,15,NULL),
 ('F2','free_text',ARRAY['barista','back-of-house-prep','senior-barista','head-barista','shift-lead-barista','store-manager','general'],NULL,true,'How many years of barista / coffee experience do you have, and what is your latte art level (none, heart, tulip, rosetta, advanced)?',NULL,16,NULL)
), ins AS (
  INSERT INTO public.quiz_questions (code, level, applies_to, required_for, required, prompt, options, sort_order)
  SELECT code, level, applies_to, required_for, required, prompt, options, sort_order FROM qs RETURNING id, code
)
INSERT INTO public.quiz_answer_keys (question_id, correct_key)
SELECT ins.id, qs.correct FROM ins JOIN qs USING (code) WHERE qs.correct IS NOT NULL;