-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('user', 'admin');
CREATE TYPE public.access_status AS ENUM ('pending', 'active', 'expired', 'blocked');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  username text NOT NULL,
  name text NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  access_status public.access_status NOT NULL DEFAULT 'pending',
  access_started_at timestamptz,
  access_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz
);
CREATE UNIQUE INDEX profiles_username_lower_key ON public.profiles (lower(username));
CREATE INDEX profiles_access_status_idx ON public.profiles (access_status);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ ROLE / ACCESS HELPERS ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Effective access: admins always pass; active must not be past expiry.
CREATE OR REPLACE FUNCTION public.has_course_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = _user_id
      AND (
        p.role = 'admin'
        OR (p.access_status = 'active'
            AND (p.access_expires_at IS NULL OR p.access_expires_at > now()))
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_has_course_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_course_access(auth.uid());
$$;

-- ============ PROFILE FIELD PROTECTION ============
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF current_user IN ('service_role', 'postgres', 'supabase_admin') OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  NEW.id := OLD.id;
  NEW.username := OLD.username;
  NEW.role := OLD.role;
  NEW.access_status := OLD.access_status;
  NEW.access_started_at := OLD.access_started_at;
  NEW.access_expires_at := OLD.access_expires_at;
  NEW.created_at := OLD.created_at;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_protect_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

CREATE POLICY "Users read own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles" ON public.profiles
FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Users update own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins update all profiles" ON public.profiles
FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ COURSES ============
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  code text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'published',
  lessons_count integer NOT NULL DEFAULT 0,
  modules_count integer NOT NULL DEFAULT 0,
  hours_count integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read courses" ON public.courses
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage courses" ON public.courses
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ USER COURSES ============
CREATE TABLE public.user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
CREATE INDEX user_courses_user_idx ON public.user_courses (user_id);

GRANT SELECT ON public.user_courses TO authenticated;
GRANT ALL ON public.user_courses TO service_role;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own course assignments" ON public.user_courses
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage course assignments" ON public.user_courses
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ COURSE PROGRESS ============
CREATE TABLE public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percent integer NOT NULL DEFAULT 0,
  lessons_completed integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
CREATE INDEX course_progress_user_idx ON public.course_progress (user_id);

GRANT SELECT ON public.course_progress TO authenticated;
GRANT ALL ON public.course_progress TO service_role;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own course progress" ON public.course_progress
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins read all course progress" ON public.course_progress
FOR SELECT TO authenticated USING (public.is_admin());

-- ============ LESSON PROGRESS ============
CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  lesson_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  score integer,
  words_learned integer NOT NULL DEFAULT 0,
  duration_seconds integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX lesson_progress_user_idx ON public.lesson_progress (user_id);

GRANT SELECT ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own lesson progress" ON public.lesson_progress
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins read all lesson progress" ON public.lesson_progress
FOR SELECT TO authenticated USING (public.is_admin());

-- Writes to lesson progress only happen server-side (verified access), so no
-- INSERT/UPDATE policy for regular users on purpose.

-- ============ COURSE CATALOG SEED (static content, not user data) ============
INSERT INTO public.courses (slug, code, title, description, status, lessons_count, modules_count, hours_count, sort_order) VALUES
  ('a1', 'A1', 'Венгерский язык A1', 'Алфавит, произношение, первые фразы и уверенное знакомство.', 'published', 60, 12, 30, 1),
  ('a2', 'A2', 'Венгерский A2', 'Повседневные ситуации, прошедшее время и расширенный словарь.', 'draft', 72, 14, 38, 2),
  ('b1', 'B1', 'Венгерский B1', 'Свободные диалоги, падежи и работа с настоящими текстами.', 'draft', 84, 16, 46, 3),
  ('speaking', 'SPK', 'Разговорный венгерский', 'Живые диалоги, интонация и уверенная речь в реальных ситуациях.', 'soon', 40, 8, 22, 4);