-- ============================================
-- QuestKid Seed Data
-- ============================================

-- Insert sample courses
insert into public.courses (title, subtitle, icon_name, bg_color, total_lessons) values
  ('React Basics', 'Learn the fundamentals', 'Zap', 'bg-sky', 12),
  ('JavaScript Mastery', 'Deep dive into JS', 'Code', 'bg-coral', 15),
  ('Web Design Bootcamp', 'CSS & Layout mastery', 'Palette', 'bg-banana', 10),
  ('TypeScript Pro', 'Type-safe development', 'Shield', 'bg-mint', 14)
on conflict do nothing;

-- Insert sample badges
insert into public.badges (name, description, icon_name, color) values
  ('Speed Demon', 'Complete 3 lessons in a day', 'Zap', 'bg-coral'),
  ('Consistency King', 'Maintain a 7-day streak', 'Flame', 'bg-banana'),
  ('Master Coder', 'Complete an entire course', 'Trophy', 'bg-sky'),
  ('Quiz Wizard', 'Score 100% on 5 quizzes', 'Sparkles', 'bg-grape'),
  ('Helpful Hand', 'Help another user 10 times', 'Heart', 'bg-bubblegum'),
  ('Night Owl', 'Complete a lesson after 9 PM', 'Moon', 'bg-ink')
on conflict do nothing;

-- Optional: Insert demo user profiles (replace with real auth users later)
-- Uncomment and modify as needed:
/*
insert into public.profiles (id, display_name, avatar_emoji, xp, streak_days) values
  ('00000000-0000-0000-0000-000000000001', 'Alex', '🚀', 1250, 5),
  ('00000000-0000-0000-0000-000000000002', 'Jordan', '⚡', 980, 3),
  ('00000000-0000-0000-0000-000000000003', 'Casey', '🎨', 1100, 7)
on conflict do nothing;
*/
