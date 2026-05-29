# QuestKid Backend Setup Guide

This directory contains all backend configuration, database schemas, and setup instructions for QuestKid's Supabase integration.

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Click **"New Project"** and fill in the details:
   - **Project Name**: questkid (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to you
3. Wait for the project to be created (2-3 minutes)

### 2. Get Your Environment Variables

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local` in the root directory:

   ```bash
   cp .env.local.example .env.local
   ```

2. Paste your Supabase credentials into `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Create Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `backend/sql/schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** button
6. You should see: **"Success. No rows returned"**

### 5. Seed Sample Data

1. Create a new query in SQL Editor
2. Copy the entire contents of `backend/sql/seed.sql`
3. Paste it into the SQL editor
4. Click **"Run"**

You should now see sample courses and badges in your database!

### 6. Verify Your Setup

In the Supabase dashboard:

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `courses` (with 4 sample courses)
   - `badges` (with 6 sample badges)
   - `user_course_progress`
   - `user_badges`
   - `profiles`

✅ **If you see all these tables, your backend is ready!**

## Project Structure

```
backend/
├── sql/
│   ├── schema.sql       # Database schema (tables, indexes, RLS policies)
│   └── seed.sql         # Sample data (courses, badges)
└── README.md            # This file

src/
├── integrations/supabase/
│   ├── client.ts        # Supabase client configuration
│   └── auth-middleware.ts # Authentication middleware for server functions
├── lib/
│   ├── queries/
│   │   ├── courses.ts   # Course queries
│   │   ├── badges.ts    # Badge queries
│   │   └── profiles.ts  # User profile & leaderboard queries
│   └── supabase.functions.ts # TanStack server functions (exported API)
```

## Database Schema Overview

### `courses`
- id, title, subtitle, icon_name, bg_color, total_lessons, created_at

### `user_course_progress`
- user_id, course_id, progress (0-100), updated_at

### `badges`
- id, name, description, icon_name, color, created_at

### `user_badges`
- user_id, badge_id, unlocked_at

### `profiles`
- id (references auth.users), display_name, avatar_emoji, xp, streak_days, last_activity_at, created_at, updated_at

## Using the Server Functions in Components

### Fetch all courses:

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAllCoursesServerFn } from "@/lib/supabase.functions";

function CoursesPage() {
  const getAllCourses = useServerFn(getAllCoursesServerFn);
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Fetch user profile with leaderboard:

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  getUserProfileServerFn,
  getLeaderboardServerFn,
} from "@/lib/supabase.functions";

function LeaderboardPage() {
  const getLeaderboard = useServerFn(getLeaderboardServerFn);
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  return (
    <div>
      {leaderboard.map((user, index) => (
        <div key={user.id}>
          #{index + 1} {user.display_name} - {user.xp} XP
        </div>
      ))}
    </div>
  );
}
```

## Available Server Functions

### Courses
- `getAllCoursesServerFn()` - Get all courses
- `getUserCoursesServerFn({ userId })` - Get user's courses with progress
- `updateCourseProgressServerFn({ userId, courseId, progress })` - Update progress

### Badges
- `getAllBadgesServerFn()` - Get all badge definitions
- `getUserBadgesServerFn({ userId })` - Get user's unlocked badges
- `getBadgeStatusServerFn({ userId })` - Get locked vs unlocked badges
- `awardBadgeServerFn({ userId, badgeId })` - Award a badge

### Profiles
- `getUserProfileServerFn({ userId })` - Get user's profile
- `getLeaderboardServerFn()` - Get top 10 users
- `createUserProfileServerFn({ userId, displayName?, avatarEmoji? })` - Create new profile
- `updateUserProfileServerFn({ userId, updates })` - Update profile
- `addXPServerFn({ userId, amount })` - Add XP to user

## Row Level Security (RLS)

The database includes RLS policies for security:

- ✅ Users can only see their own progress
- ✅ Users can only see their own badges
- ✅ Users can manage their own profile
- ✅ Everyone can see profiles (for leaderboard)

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists in the root directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly

### "Invalid token" when calling server functions
- The authentication headers are not being passed correctly
- Ensure you're using `useServerFn` from TanStack React Start

### Tables not appearing in Table Editor
- Go to SQL Editor and re-run `backend/sql/schema.sql`
- Check the "Execution Results" for any errors

### Data not showing up
- Make sure you ran `backend/sql/seed.sql` to insert sample data
- Check the Table Editor to see if data was actually inserted

## Next Steps

1. ✅ Database is set up
2. ✅ Server functions are available
3. 🔄 **Next**: Integrate these functions into your React components
   - Update `src/routes/courses.tsx` to fetch real data
   - Update `src/routes/leaderboard.tsx` to use leaderboard function
   - Update other routes as needed

4. 🔄 **Then**: Add authentication
   - Set up Supabase Auth (Google OAuth, Email/Password)
   - Create login/signup flows
   - Protect routes that require authentication

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)

---

**Need help?** Check the main README.md or create an issue on GitHub!



Orrang3@321303