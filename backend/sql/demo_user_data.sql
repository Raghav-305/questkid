-- ============================================
-- QuestKid Demo User Data
-- ============================================
--
-- Run backend/sql/schema.sql and backend/sql/seed.sql first.
-- Then create users in Supabase Auth.
--
-- This file derives rows from existing auth.users records because:
--   public.profiles.id references auth.users(id)
--   public.user_badges.user_id references auth.users(id)
--   public.user_course_progress.user_id references auth.users(id)

with ranked_users as (
  select
    id,
    row_number() over (order by created_at, id) as rn
  from auth.users
  limit 5
),
demo_profiles as (
  select *
  from (
    values
      (1, 'Maya', 'M', 18420, 12),
      (2, 'Leo', 'L', 16980, 9),
      (3, 'Aria', 'A', 15110, 7),
      (4, 'Theo', 'T', 13220, 5),
      (5, 'Nina', 'N', 12640, 4)
  ) as v(rn, display_name, avatar_emoji, xp, streak_days)
)
insert into public.profiles (
  id,
  display_name,
  avatar_emoji,
  xp,
  streak_days,
  last_activity_at
)
select
  u.id,
  p.display_name,
  p.avatar_emoji,
  p.xp,
  p.streak_days,
  now()
from ranked_users u
join demo_profiles p on p.rn = u.rn
on conflict (id) do update set
  display_name = excluded.display_name,
  avatar_emoji = excluded.avatar_emoji,
  xp = excluded.xp,
  streak_days = excluded.streak_days,
  last_activity_at = excluded.last_activity_at,
  updated_at = now();

with ranked_users as (
  select
    id,
    row_number() over (order by created_at, id) as user_rank
  from auth.users
  limit 5
),
ranked_courses as (
  select
    id,
    row_number() over (order by created_at, id) as course_rank
  from public.courses
),
demo_progress as (
  select *
  from (
    values
      (1, 1, 100), (1, 2, 85), (1, 3, 60), (1, 4, 35),
      (2, 1, 90),  (2, 2, 72), (2, 3, 48), (2, 4, 20),
      (3, 1, 76),  (3, 2, 55), (3, 3, 30), (3, 4, 12),
      (4, 1, 64),  (4, 2, 42), (4, 3, 18), (4, 4, 0),
      (5, 1, 50),  (5, 2, 25), (5, 3, 10), (5, 4, 0)
  ) as v(user_rank, course_rank, progress)
)
insert into public.user_course_progress (
  user_id,
  course_id,
  progress,
  updated_at
)
select
  u.id,
  c.id,
  p.progress,
  now()
from demo_progress p
join ranked_users u on u.user_rank = p.user_rank
join ranked_courses c on c.course_rank = p.course_rank
on conflict (user_id, course_id) do update set
  progress = excluded.progress,
  updated_at = excluded.updated_at;

with ranked_users as (
  select
    id,
    row_number() over (order by created_at, id) as user_rank
  from auth.users
  limit 5
),
ranked_badges as (
  select
    id,
    row_number() over (order by created_at, id) as badge_rank
  from public.badges
)
insert into public.user_badges (
  user_id,
  badge_id,
  unlocked_at
)
select
  u.id,
  b.id,
  now() - ((u.user_rank + b.badge_rank) || ' days')::interval
from ranked_users u
join ranked_badges b
  on b.badge_rank <= case
    when u.user_rank = 1 then 6
    when u.user_rank = 2 then 5
    when u.user_rank = 3 then 4
    when u.user_rank = 4 then 3
    else 2
  end
on conflict (user_id, badge_id) do update set
  unlocked_at = excluded.unlocked_at;
