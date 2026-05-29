-- ============================================
-- QuestKid Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Courses Table
-- ============================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  icon_name text not null,        -- e.g. 'Rocket' (lucide-react name)
  bg_color text not null,         -- e.g. 'bg-sky'
  total_lessons int not null default 0,
  created_at timestamptz default now()
);

-- ============================================
-- User Progress per Course
-- ============================================
create table if not exists public.user_course_progress (
  user_id uuid references auth.users on delete cascade,
  course_id uuid references public.courses on delete cascade,
  progress int not null default 0,    -- 0-100
  updated_at timestamptz default now(),
  primary key (user_id, course_id)
);

-- ============================================
-- Badges (Definitions)
-- ============================================
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_name text not null,
  color text not null,
  created_at timestamptz default now()
);

-- ============================================
-- User Badges (Per-user Unlocks)
-- ============================================
create table if not exists public.user_badges (
  user_id uuid references auth.users on delete cascade,
  badge_id uuid references public.badges on delete cascade,
  unlocked_at timestamptz default now(),
  primary key (user_id, badge_id)
);

-- ============================================
-- User Profiles (XP, Streak, Display Info)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_emoji text default '🚀',
  xp int not null default 0,
  streak_days int not null default 0,
  last_activity_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_user_course_progress_user on public.user_course_progress(user_id);
create index if not exists idx_user_course_progress_course on public.user_course_progress(course_id);
create index if not exists idx_user_badges_user on public.user_badges(user_id);
create index if not exists idx_user_badges_badge on public.user_badges(badge_id);
create index if not exists idx_profiles_created on public.profiles(created_at);
create index if not exists idx_courses_created on public.courses(created_at);

-- ============================================
-- GRANTS (for Supabase Data API)
-- ============================================
grant select on public.courses to anon, authenticated;
grant select on public.badges to anon, authenticated;
grant select, insert, update on public.user_course_progress to authenticated;
grant select, insert, update on public.user_badges to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant all on all tables in schema public to service_role;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
alter table public.user_course_progress enable row level security;
alter table public.user_badges enable row level security;
alter table public.profiles enable row level security;

-- User can only see their own progress
create policy "user_own_progress" on public.user_course_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- User can only see their own badges
create policy "user_own_badges" on public.user_badges
  for select to authenticated
  using (auth.uid() = user_id);

-- User can manage their own profile
create policy "user_own_profile" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Everyone can read profiles (for leaderboard)
create policy "profiles_public_read" on public.profiles
  for select to anon, authenticated
  using (true);
