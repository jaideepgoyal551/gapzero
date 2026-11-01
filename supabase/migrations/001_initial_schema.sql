-- GapZero Supabase Database Schema Migration
-- Enables Row Level Security (RLS) on all user-owned tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    education_level TEXT,
    current_role TEXT,
    years_of_experience NUMERIC DEFAULT 0,
    current_skills TEXT[] DEFAULT '{}',
    target_role TEXT DEFAULT '',
    target_companies TEXT[] DEFAULT '{}',
    preferred_country TEXT DEFAULT 'United States',
    preferred_work_arrangement TEXT DEFAULT 'Remote',
    weekly_learning_hours NUMERIC DEFAULT 10,
    career_goals TEXT DEFAULT '',
    github_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. RESUME ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    parsed_text TEXT,
    target_role TEXT NOT NULL,
    overall_score NUMERIC NOT NULL,
    career_fit_score NUMERIC NOT NULL,
    ats_score NUMERIC NOT NULL,
    extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    strongest_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    important_weaknesses TEXT[] DEFAULT '{}',
    experience_relevance JSONB NOT NULL DEFAULT '{}'::jsonb,
    project_relevance JSONB NOT NULL DEFAULT '{}'::jsonb,
    recommended_improvements TEXT[] DEFAULT '{}',
    suggested_next_steps TEXT[] DEFAULT '{}',
    scoring_rationale JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume analyses"
    ON public.resume_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume analyses"
    ON public.resume_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analyses"
    ON public.resume_analyses FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_user ON public.resume_analyses(user_id);

-- 3. SKILL ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    overall_fit_score NUMERIC NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    coverage_by_category JSONB NOT NULL DEFAULT '[]'::jsonb,
    top_strengths TEXT[] DEFAULT '{}',
    critical_gaps TEXT[] DEFAULT '{}',
    recommended_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skill assessments"
    ON public.skill_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skill assessments"
    ON public.skill_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skill assessments"
    ON public.skill_assessments FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_skill_assessments_user ON public.skill_assessments(user_id);

-- 4. CAREER ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    progress_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roadmaps"
    ON public.career_roadmaps FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps"
    ON public.career_roadmaps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps"
    ON public.career_roadmaps FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps"
    ON public.career_roadmaps FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_career_roadmaps_user ON public.career_roadmaps(user_id);

-- 5. ROADMAP TASKS TABLE
CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES public.career_roadmaps(id) ON DELETE CASCADE,
    phase TEXT NOT NULL, -- '30-day', '90-day', '12-month'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    estimated_duration TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    learning_resources JSONB NOT NULL DEFAULT '[]'::jsonb,
    expected_outcome TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage tasks of their roadmaps"
    ON public.roadmap_tasks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.career_roadmaps
            WHERE public.career_roadmaps.id = roadmap_tasks.roadmap_id
            AND public.career_roadmaps.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_roadmap ON public.roadmap_tasks(roadmap_id);

-- 6. JOB MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.job_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company_name TEXT,
    job_description TEXT NOT NULL,
    match_percentage NUMERIC NOT NULL,
    matching_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    matching_experience TEXT[] DEFAULT '{}',
    missing_experience TEXT[] DEFAULT '{}',
    resume_tailoring_suggestions TEXT[] DEFAULT '{}',
    recommended_prep_tasks TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own job matches"
    ON public.job_matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job matches"
    ON public.job_matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job matches"
    ON public.job_matches FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_job_matches_user ON public.job_matches(user_id);

-- 7. LINKEDIN ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.linkedin_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    headline_suggestions TEXT[] DEFAULT '{}',
    improved_about TEXT,
    experience_improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_skills TEXT[] DEFAULT '{}',
    relevant_keywords TEXT[] DEFAULT '{}',
    networking_and_content_strategy TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.linkedin_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own linkedin analyses"
    ON public.linkedin_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own linkedin analyses"
    ON public.linkedin_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 8. GITHUB ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.github_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    profile_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    analyzed_repositories JSONB NOT NULL DEFAULT '[]'::jsonb,
    language_distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
    portfolio_strengths TEXT[] DEFAULT '{}',
    documentation_gaps TEXT[] DEFAULT '{}',
    project_improvement_suggestions TEXT[] DEFAULT '{}',
    recommended_next_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    role_alignment_score NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.github_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own github analyses"
    ON public.github_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own github analyses"
    ON public.github_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 9. COACH CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.coach_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
    ON public.coach_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
    ON public.coach_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
    ON public.coach_conversations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
    ON public.coach_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- 10. COACH MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.coach_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.coach_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user' | 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their conversations"
    ON public.coach_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.coach_conversations
            WHERE public.coach_conversations.id = coach_messages.conversation_id
            AND public.coach_conversations.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_coach_messages_convo ON public.coach_messages(conversation_id);

-- 11. AUTOMATIC PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
