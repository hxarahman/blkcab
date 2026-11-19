CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, role public.app_role NOT NULL, UNIQUE (user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.job_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  team text,
  location text DEFAULT 'London',
  employment_type text DEFAULT 'FULL_TIME',
  summary text, description text,
  responsibilities text[] DEFAULT '{}', requirements text[] DEFAULT '{}',
  pay text DEFAULT 'Competitive — [PLACEHOLDER: pay to be confirmed]',
  hours text DEFAULT '[PLACEHOLDER: hours to be confirmed]',
  perks text[] DEFAULT '{"[PLACEHOLDER: perks to be confirmed]"}',
  is_open boolean DEFAULT true,
  sort_order int DEFAULT 0,
  date_posted date DEFAULT current_date,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
GRANT SELECT ON public.job_roles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_roles TO authenticated;
GRANT ALL ON public.job_roles TO service_role;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read open roles" ON public.job_roles FOR SELECT TO anon, authenticated USING (is_open = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert roles" ON public.job_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update roles" ON public.job_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete roles" ON public.job_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER job_roles_updated BEFORE UPDATE ON public.job_roles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES public.job_roles(id) ON DELETE SET NULL,
  role_title text, full_name text NOT NULL, email text NOT NULL, phone text,
  location text DEFAULT 'London', right_to_work_uk boolean, availability text, about text, cv_path text,
  gdpr_consent boolean NOT NULL, consent_at timestamptz,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','shortlisted','interviewed','offered','rejected')),
  admin_notes text, created_at timestamptz DEFAULT now());
GRANT INSERT ON public.job_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.job_applications FOR INSERT TO anon, authenticated WITH CHECK (gdpr_consent = true AND status = 'new' AND admin_notes IS NULL);
CREATE POLICY "Admins read apps" ON public.job_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update apps" ON public.job_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete apps" ON public.job_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.careers_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  notification_email text DEFAULT 'careers@blkcabcoffee.com',
  notifications_enabled boolean DEFAULT false);
GRANT SELECT, INSERT, UPDATE ON public.careers_settings TO authenticated;
GRANT ALL ON public.careers_settings TO service_role;
ALTER TABLE public.careers_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read settings" ON public.careers_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert settings" ON public.careers_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update settings" ON public.careers_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.careers_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

INSERT INTO public.job_roles (slug,title,team,summary,description,responsibilities,requirements,sort_order) VALUES
('barista','Barista','Front of House','Craft great coffee and great moments for every guest at the bar.','Join the BLK CAB bar team in London. You''ll dial in espresso, steam silky milk and make every guest feel at home — Coffee & People, every shift.',ARRAY['Prepare espresso, milk and matcha drinks to BLK CAB spec','Welcome guests and take orders with warmth','Keep the bar clean, stocked and organised','Follow food safety and opening/closing routines'],ARRAY['Barista experience preferred, attitude essential','Genuine love of hospitality','Reliable, punctual and a team player','Right to work in the UK'],1),
('back-of-house-prep','Back of House Prep','Kitchen','Keep our kitchen running — prep, stock and quality behind the scenes.','Our prep team makes sure every syrup, cold foam and pastry is ready before the doors open. Precision and pace matter here.',ARRAY['Prepare syrups, foams and food items to recipe','Rotate and label stock','Maintain kitchen hygiene and safety logs','Support the bar during busy periods'],ARRAY['Kitchen or prep experience a plus','Food hygiene awareness (Level 2 desirable)','Organised and detail-focused','Right to work in the UK'],2),
('senior-barista','Senior Barista','Front of House','Lead by example on bar quality, speed and service.','An experienced barista who sets the standard on bar, coaches newer team members and keeps quality consistent through every rush.',ARRAY['Dial in espresso daily and maintain recipes','Coach and support baristas on bar','Champion service standards','Help with stock and equipment care'],ARRAY['1+ years specialty coffee experience','Confident with latte art and calibration','Calm under pressure','Right to work in the UK'],3),
('head-barista','Head Barista','Front of House','Own coffee quality and training across the shop.','You''ll be responsible for coffee quality, team training and the bar experience, working closely with the Store Manager.',ARRAY['Own coffee quality, recipes and calibration','Train and develop the barista team','Manage coffee ordering and equipment maintenance','Run shifts and support the manager'],ARRAY['2+ years specialty coffee experience','Experience training others','Strong sensory and technical skills','Right to work in the UK'],4),
('store-manager','Store Manager','Management','Run a BLK CAB shop — people, performance and culture.','Lead the shop day to day: build and develop the team, deliver standout hospitality and own the store''s results.',ARRAY['Recruit, rota and develop the team','Deliver service and quality standards','Manage stock, costs and store performance','Keep the shop safe, compliant and on-brand'],ARRAY['Hospitality management experience','Strong people leadership','Commercial awareness','Right to work in the UK'],5),
('shift-lead-barista','Shift Lead Barista','Front of House','Run the floor on shift and keep the team in flow.','Lead shifts on bar and floor, making sure the team, the guests and the coffee are all looked after.',ARRAY['Lead opening, closing and shift handovers','Deploy the team during busy periods','Handle guest feedback with care','Cash-up and shift reporting'],ARRAY['Barista experience, ideally specialty','Some supervisory experience','Clear communicator','Right to work in the UK'],6);

CREATE POLICY "Anyone can upload CVs" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'cvs');
CREATE POLICY "Admins read CVs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'cvs' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete CVs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cvs' AND public.has_role(auth.uid(),'admin'));