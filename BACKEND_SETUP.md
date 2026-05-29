# QuestKid Supabase Backend — Complete Setup

## 📦 What's Been Created

Your QuestKid backend is now fully scaffolded with Supabase integration. Here's what's been set up:

### **Backend Folder** (`/backend`)
```
backend/
├── sql/
│   ├── schema.sql    # Database schema (tables, indexes, RLS)
│   └── seed.sql      # Sample courses & badges
└── README.md         # Full backend documentation
```

### **Integration Files** (`/src/integrations/supabase`)
```
src/integrations/supabase/
├── client.ts              # Supabase client setup
└── auth-middleware.ts     # Auth middleware for server functions
```

### **Query Functions** (`/src/lib/queries`)
```
src/lib/queries/
├── courses.ts   # Course queries (get all, get user's, update progress)
├── badges.ts    # Badge queries (get all, get user's, award badges)
└── profiles.ts  # Profile queries (get profile, leaderboard, XP)
```

### **Server Functions** (`/src/lib`)
```
src/lib/
├── supabase.functions.ts  # TanStack Server Functions (use in components)
├── types.ts               # TypeScript type definitions
└── queries/
    ├── courses.ts
    ├── badges.ts
    └── profiles.ts
```

### **Custom Hooks** (`/src/hooks`)
```
src/hooks/
└── useData.ts  # useAuth, useProfile, useUserCourses, useLeaderboard, etc.
```

### **Configuration**
```
.env.local.example  # Template for environment variables
BACKEND_INTEGRATION.md  # Step-by-step integration guide
```

---

## 🚀 Quick Start (5 Steps)

### **Step 1: Install Dependencies**
```bash
bun add @supabase/supabase-js @supabase/ssr
```

### **Step 2: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up → Create New Project
3. Choose a region close to you
4. Wait for provisioning (2-3 mins)

### **Step 3: Get Environment Variables**
In Supabase Dashboard:
1. **Settings** → **API**
2. Copy these values:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`  
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### **Step 4: Set Up `.env.local`**
```bash
cp .env.local.example .env.local
```
Then paste your credentials into `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiI...
```

### **Step 5: Create Database & Seed Data**

#### Create Schema:
1. In Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy `backend/sql/schema.sql` 
3. Paste & click **Run**

#### Seed Data:
1. **SQL Editor** → **New Query**
2. Copy `backend/sql/seed.sql`
3. Paste & click **Run**

✅ **Your backend is now ready!**

---

## 📚 Database Schema

| Table | Purpose |
|-------|---------|
| **courses** | Course definitions (title, icon, progress tracking) |
| **user_course_progress** | User's progress on each course (0-100) |
| **badges** | Badge definitions |
| **user_badges** | Which badges users have unlocked |
| **profiles** | User profiles (XP, streak, display name) |

All tables include:
- ✅ Row Level Security (RLS) policies
- ✅ Proper foreign keys & cascading deletes
- ✅ Performance indexes
- ✅ Automatic timestamps

---

## 🔌 Using Server Functions in Components

### **Example: Fetch All Courses**

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
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### **Example: Get User Profile with Hook**

```tsx
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useData";

function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id || null);

  return (
    <div>
      <h1>{profile?.display_name} {profile?.avatar_emoji}</h1>
      <p>XP: {profile?.xp}</p>
      <p>Streak: {profile?.streak_days} days</p>
    </div>
  );
}
```

### **Example: Mutation (Update Progress)**

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseProgressServerFn } from "@/lib/supabase.functions";

function CourseCard({ courseId, userId }: Props) {
  const queryClient = useQueryClient();
  const updateProgress = useServerFn(updateCourseProgressServerFn);

  const mutation = useMutation({
    mutationFn: (progress: number) =>
      updateProgress({ userId, courseId, progress }),
    onSuccess: () => {
      // Refetch courses after update
      queryClient.invalidateQueries({ queryKey: ["userCourses"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate(75)}>
      Update to 75%
    </button>
  );
}
```

---

## 📋 Available Server Functions

### **Courses**
- `getAllCoursesServerFn()` - Get all courses
- `getUserCoursesServerFn({ userId })` - Get user's courses with progress
- `updateCourseProgressServerFn({ userId, courseId, progress })` - Update progress

### **Badges**
- `getAllBadgesServerFn()` - Get all badge definitions
- `getUserBadgesServerFn({ userId })` - Get user's unlocked badges
- `getBadgeStatusServerFn({ userId })` - Get locked vs unlocked badges
- `awardBadgeServerFn({ userId, badgeId })` - Award a badge

### **Profiles & Leaderboard**
- `getUserProfileServerFn({ userId })` - Get user's profile
- `getLeaderboardServerFn()` - Get top 10 users
- `createUserProfileServerFn({ userId, displayName?, avatarEmoji? })` - Create profile
- `updateUserProfileServerFn({ userId, updates })` - Update profile
- `addXPServerFn({ userId, amount })` - Add XP to user

---

## 🪝 Custom Hooks

All hooks are in `src/hooks/useData.ts`:

```tsx
// Authentication
const { user, isAuthenticated, signOut } = useAuth();

// User Profile
const { profile, isLoading } = useProfile(userId);

// User's Courses
const { courses } = useUserCourses(userId);

// User's Badges
const { badges } = useUserBadges(userId);

// Global Leaderboard
const { users } = useLeaderboard();
```

---

## 🛡️ Security

### Row Level Security (RLS)
- ✅ Users can only see their own progress
- ✅ Users can only see their own badges
- ✅ Users can manage only their own profile
- ✅ Everyone can view profiles (leaderboard)

### Environment Variables
- `VITE_*` variables are exposed to the client (OK)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (keep secret!)

---

## 🎨 Component Integration Checklist

- [ ] Update `src/routes/courses.tsx` with `getAllCoursesServerFn()`
- [ ] Update `src/routes/leaderboard.tsx` with `getLeaderboardServerFn()`
- [ ] Update `src/routes/achievements.tsx` with `getBadgeStatusServerFn()`
- [ ] Update `src/routes/index.tsx` (dashboard) with `useProfile()` & `useUserCourses()`
- [ ] Create skeleton loaders with `.animate-pulse`
- [ ] Add error handling & retry buttons
- [ ] Add Suspense boundaries for better UX
- [ ] Update `CourseCard` to accept database Course objects
- [ ] Update `BadgeCard` to accept Badge objects with unlock status
- [ ] Update `BadgePodium` to use leaderboard data

---

## 📚 Additional Resources

- **Backend Setup**: [backend/README.md](./backend/README.md)
- **Integration Guide**: [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- **Database Types**: [src/lib/types.ts](./src/lib/types.ts)
- **Supabase Docs**: https://supabase.com/docs
- **TanStack Docs**: https://tanstack.com/start/latest

---

## 🔧 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
bun add @supabase/supabase-js @supabase/ssr
```

### "Missing Supabase environment variables"
- Check `.env.local` exists and has correct values
- Restart your dev server after changing `.env.local`

### "No data showing up"
1. Check Table Editor in Supabase (data should be there)
2. Re-run `backend/sql/seed.sql` if tables are empty
3. Check browser console for errors
4. Verify RLS policies allow reads

### Tables not appearing
- Go to SQL Editor and re-run `backend/sql/schema.sql`
- Check the Results tab for any error messages

---

## 🎯 Next Steps

1. ✅ Backend set up
2. 🔄 Integrate routes with server functions (see checklist above)
3. 🔄 Add authentication (Supabase Auth → OAuth/Email)
4. 🔄 Add real-time updates (Supabase Realtime subscriptions)
5. 🔄 Deploy to production (Vercel + Supabase)

---

**Ready to build something amazing!** 🚀

If you get stuck, check [backend/README.md](./backend/README.md) or [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed examples.
