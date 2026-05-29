# Supabase Setup for TanStack Start

Your Supabase project is now configured! Here's what you need to do next:

## 📋 Step 1: Get Your Service Role Key

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Under "Project API keys", find **service_role secret**
4. Click the eye icon to reveal it
5. Copy the entire key

## 📝 Step 2: Add Service Role Key to `.env.local`

Open `.env.local` in your project root and update:

```env
VITE_SUPABASE_URL=https://wddsfkiibqlkgsdtphfi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Eq-_KCvS69FlMIUE5QRGTQ_TbB02feA
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here_REPLACE_THIS
```

Replace `your_service_role_key_here_REPLACE_THIS` with your actual service role key.

⚠️ **NEVER commit `.env.local` to git!** It's already in `.gitignore`.

---

## 🔄 TanStack Start vs Next.js

You provided Next.js patterns, but this project uses **TanStack Start**. Here's the difference:

### ❌ Next.js Pattern (What You Provided)
```tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/handlers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: todos } = await supabase.from('todos').select()
  return <ul>{todos?.map(todo => ...)}</ul>
}
```

### ✅ TanStack Start Pattern (What You Should Use)
```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAllTodosServerFn } from "@/lib/supabase.functions";

export default function Page() {
  const getAllTodos = useServerFn(getAllTodosServerFn);
  const { data: todos = [] } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTodos,
  });

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}
```

---

## 📚 Available Resources

All the TanStack Start Supabase integration files have been created:

### Server Functions (Ready to Use)
**File:** `src/lib/supabase.functions.ts`
```tsx
// Courses
getAllCoursesServerFn()
getUserCoursesServerFn({ userId })
updateCourseProgressServerFn({ userId, courseId, progress })

// Badges
getAllBadgesServerFn()
getUserBadgesServerFn({ userId })
getBadgeStatusServerFn({ userId })
awardBadgeServerFn({ userId, badgeId })

// Profiles & Leaderboard
getUserProfileServerFn({ userId })
getLeaderboardServerFn()
createUserProfileServerFn({ userId, displayName, avatarEmoji })
updateUserProfileServerFn({ userId, updates })
addXPServerFn({ userId, amount })
```

### Custom Hooks (Ready to Use)
**File:** `src/hooks/useData.ts`
```tsx
const { user, isAuthenticated, signOut } = useAuth()
const { profile } = useProfile(userId)
const { courses } = useUserCourses(userId)
const { badges } = useUserBadges(userId)
const { users } = useLeaderboard()
```

### Database Queries
**Files:** `src/lib/queries/`
- `courses.ts` — Course operations
- `badges.ts` — Badge operations
- `profiles.ts` — Profile & leaderboard operations

---

## 🚀 Quick Example: Fetch Courses

### In Your Route Component

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAllCoursesServerFn } from "@/lib/supabase.functions";
import { Suspense } from "react";

function CoursesPage() {
  return (
    <div>
      <h1>My Courses</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CoursesList />
      </Suspense>
    </div>
  );
}

function CoursesList() {
  const getAllCourses = useServerFn(getAllCoursesServerFn);
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  if (isLoading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div key={course.id} className="p-4 border rounded">
          <h2>{course.title}</h2>
          <p>{course.subtitle}</p>
          <div className="mt-2">
            Progress: {course.progress || 0}%
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoursesPage;
```

---

## ✅ Setup Checklist

- [x] Environment variables configured (`.env.local`)
- [x] Supabase client set up (`src/integrations/supabase/client.ts`)
- [x] Server functions created (`src/lib/supabase.functions.ts`)
- [x] Custom hooks created (`src/hooks/useData.ts`)
- [x] TypeScript types defined (`src/lib/types.ts`)
- [ ] **TODO:** Get service role key and add to `.env.local`
- [ ] **TODO:** Update your routes to use server functions
- [ ] **TODO:** Add authentication (optional)
- [ ] **TODO:** Deploy to production

---

## 🔗 Further Reading

- [BACKEND_SETUP.md](../BACKEND_SETUP.md) — Full backend guide
- [BACKEND_INTEGRATION.md](../BACKEND_INTEGRATION.md) — Component integration examples
- [backend/README.md](../backend/README.md) — Database schema documentation
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Supabase Docs](https://supabase.com/docs)

---

## 🆘 Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY is not set"
- Make sure you added it to `.env.local`
- Restart your dev server after adding the key
- The key should start with `eyJ...` (it's a JWT token)

### "Cannot query data"
- Verify your `.env.local` has all three variables
- Check that your database schema was created (see `backend/sql/schema.sql`)
- Make sure seed data was inserted (see `backend/sql/seed.sql`)

### "Module not found" errors
- Run `npm install @supabase/supabase-js @supabase/ssr` ✅ (already done)
- Restart your dev server

---

**You're ready to go!** 🚀 The only remaining step is to get the service role key and update `.env.local`.
