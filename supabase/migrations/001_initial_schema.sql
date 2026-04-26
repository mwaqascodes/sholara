-- =========================================================
-- PakEducate SaaS Schema — Migration 001
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────
-- SCHOOLS (multi-tenant root)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schools (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  address       TEXT,
  city          TEXT,
  phone         TEXT,
  email         TEXT,
  logo_url      TEXT,
  principal     TEXT,
  board         TEXT DEFAULT 'Federal',
  medium        TEXT DEFAULT 'English',
  reg_no        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL DEFAULT 'trial',   -- trial | basic | standard | premium
  status          TEXT NOT NULL DEFAULT 'active',  -- active | expired | cancelled
  trial_ends_at   TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end   TIMESTAMPTZ,
  monthly_price   NUMERIC(10,2),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- PROFILES (user roles + school binding)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'admin',  -- super_admin | school_admin | admin | teacher | parent | student
  school_id     UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  school_name   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- EXAMS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exams (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id     UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  type          TEXT DEFAULT 'midterm',   -- quiz | midterm | final | monthly | unit
  class_name    TEXT,
  section       TEXT,
  academic_year TEXT DEFAULT '2025-2026',
  start_date    DATE,
  end_date      DATE,
  status        TEXT DEFAULT 'upcoming', -- upcoming | ongoing | completed
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- EXAM SUBJECTS (marks config per subject)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exam_subjects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id       UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  subject_name  TEXT NOT NULL,
  total_marks   INTEGER NOT NULL DEFAULT 100,
  passing_marks INTEGER NOT NULL DEFAULT 40
);

-- ─────────────────────────────────────────────────────────
-- STUDENT MARKS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_marks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id         UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  exam_subject_id UUID REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  student_name    TEXT NOT NULL,
  student_id      TEXT,
  class_name      TEXT,
  section         TEXT,
  roll_no         INTEGER,
  obtained_marks  NUMERIC(6,2) NOT NULL DEFAULT 0,
  is_absent       BOOLEAN DEFAULT FALSE,
  entered_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- FEE INVOICES
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fee_invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  student_name    TEXT NOT NULL,
  student_id      TEXT,
  class_name      TEXT,
  month           TEXT,  -- e.g. "April 2026"
  fee_type        TEXT DEFAULT 'monthly',  -- monthly | term | admission | other
  amount          NUMERIC(10,2) NOT NULL,
  paid_amount     NUMERIC(10,2) DEFAULT 0,
  status          TEXT DEFAULT 'pending', -- pending | partial | paid | overdue
  due_date        DATE,
  paid_date       DATE,
  payment_method  TEXT,  -- cash | jazzcash | easypaisa | bank
  invoice_no      TEXT UNIQUE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- MESSAGES (teacher-parent)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id     UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  sender_id     UUID REFERENCES auth.users(id),
  sender_name   TEXT,
  sender_role   TEXT,
  recipient_id  UUID REFERENCES auth.users(id),
  recipient_name TEXT,
  subject       TEXT,
  body          TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- NOTICES (school-wide notice board)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id     UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  type          TEXT DEFAULT 'general',  -- general | urgent | academic | fee | event
  audience      TEXT DEFAULT 'all',     -- all | teachers | students | parents
  pinned        BOOLEAN DEFAULT FALSE,
  published_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  created_by    UUID REFERENCES auth.users(id),
  author_name   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- ROW-LEVEL SECURITY
-- ─────────────────────────────────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subjects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_marks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_invoices   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices        ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update their own
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Super admin sees everything
CREATE POLICY "super_admin_schools" ON public.schools
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- School members see their school's data
CREATE POLICY "school_member_schools" ON public.schools
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND school_id = schools.id)
  );

-- School-scoped policies (school members only see their school)
CREATE POLICY "school_exams"     ON public.exams         FOR ALL USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "school_subjects"  ON public.exam_subjects  FOR ALL USING (exam_id IN (SELECT id FROM public.exams WHERE school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "school_marks"     ON public.student_marks  FOR ALL USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "school_invoices"  ON public.fee_invoices   FOR ALL USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "school_messages"  ON public.messages       FOR ALL USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "school_notices"   ON public.notices        FOR ALL USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "school_subs"      ON public.subscriptions  FOR ALL USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

-- ─────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at   BEFORE UPDATE ON public.schools   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at  BEFORE UPDATE ON public.profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
