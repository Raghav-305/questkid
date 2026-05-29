# QuestKid Backend Integration Guide

This guide shows how to integrate the Supabase backend into your existing QuestKid routes and components.

## Installation

First, install the required dependencies:

```bash
bun add @supabase/supabase-js @supabase/ssr
```

## Step-by-Step Integration

### Step 1: Set Environment Variables

1. Copy `.env.local.example` to `.env.local` in your root directory
2. Get your Supabase credentials from [supabase.com](https://supabase.com)
3. Fill in the environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Set Up Database

1. Log in to your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy the entire contents of `backend/sql/schema.sql`
5. Paste it and click **"Run"**
6. Repeat for `backend/sql/seed.sql` to add sample data

### Step 3: Update Routes to Fetch Real Data

#### `src/routes/courses.tsx` Example

Replace hardcoded data with server function calls:

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getAllCoursesServerFn } from "@/lib/supabase.functions";
import CourseCard from "@/components/CourseCard";
import CourseSkeleton from "@/components/CourseSkeleton";

function CoursesRoute() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesContent />
      </Suspense>
    </div>
  );
}

function CoursesContent() {
  const getAllCourses = useServerFn(getAllCoursesServerFn);
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  if (isLoading) return <CoursesSkeleton />;
  if (error) return <div className="text-red-500">Failed to load courses</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CourseSkeleton key={i} />
      ))}
    </div>
  );
}

export default CoursesRoute;
```

#### `src/routes/leaderboard.tsx` Example

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getLeaderboardServerFn } from "@/lib/supabase.functions";
import BadgePodium from "@/components/BadgePodium";
import ProfileSkeleton from "@/components/ProfileSkeleton";

function LeaderboardRoute() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent />
      </Suspense>
    </div>
  );
}

function LeaderboardContent() {
  const getLeaderboard = useServerFn(getLeaderboardServerFn);
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  if (isLoading) return <LeaderboardSkeleton />;
  if (error)
    return <div className="text-red-500">Failed to load leaderboard</div>;

  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  return (
    <div>
      {/* Top 3 Podium */}
      <BadgePodium users={topThree} />

      {/* Rest of Leaderboard */}
      <div className="mt-8 space-y-2">
        {restUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border-2 border-ink rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">#{index + 4}</span>
              <span className="text-xl">{user.avatar_emoji}</span>
              <span>{user.display_name}</span>
            </div>
            <span className="text-xl font-bold">{user.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ProfileSkeleton key={i} />
      ))}
    </div>
  );
}

export default LeaderboardRoute;
```

#### `src/routes/achievements.tsx` Example

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getBadgeStatusServerFn } from "@/lib/supabase.functions";
import BadgeCard from "@/components/BadgeCard";
import BadgeSkeleton from "@/components/BadgeSkeleton";
import { useAuth } from "@/hooks/useAuth"; // You'll need to create this

function AchievementsRoute() {
  const { user } = useAuth();

  if (!user) return <div>Please log in to view achievements</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Achievements</h1>
      <Suspense fallback={<AchievementsSkeleton />}>
        <AchievementsContent userId={user.id} />
      </Suspense>
    </div>
  );
}

function AchievementsContent({ userId }: { userId: string }) {
  const getBadgeStatus = useServerFn(getBadgeStatusServerFn);
  const { data: badgeStatus, isLoading, error } = useQuery({
    queryKey: ["badges", userId],
    queryFn: () => getBadgeStatus({ userId }),
  });

  if (isLoading) return <AchievementsSkeleton />;
  if (error) return <div className="text-red-500">Failed to load achievements</div>;

  const { unlocked = [], locked = [] } = badgeStatus || {};

  return (
    <div className="space-y-8">
      {/* Unlocked Badges */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Unlocked 🔓</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {unlocked.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} unlocked={true} />
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Locked 🔒</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locked.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} unlocked={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <BadgeSkeleton key={i} />
      ))}
    </div>
  );
}

export default AchievementsRoute;
```

### Step 4: Create Skeleton Loaders

Create animated skeleton components for better UX:

#### `src/components/CourseSkeleton.tsx`

```tsx
export function CourseSkeleton() {
  return (
    <div className="brutal-card p-6 animate-pulse">
      <div className="h-12 w-12 bg-paper rounded-lg mb-4"></div>
      <div className="h-6 bg-paper rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-paper rounded mb-4 w-1/2"></div>
      <div className="h-3 bg-paper rounded w-full"></div>
    </div>
  );
}

export default CourseSkeleton;
```

Add the pulsing animation to your `src/styles.css`:

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Step 5: Update Component Props

Update your existing components to accept database data:

#### Update `src/components/CourseCard.tsx`

```tsx
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  icon_name: string;
  bg_color: string;
  progress?: number;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // Dynamically get icon from lucide-react
  const IconComponent = (Icons[course.icon_name as keyof typeof Icons] ||
    Icons.Star) as LucideIcon;

  const progress = course.progress || 0;

  return (
    <motion.div
      className={`${course.bg_color} brutal-card p-6 cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", mass: 0.5, stiffness: 400, damping: 12 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{course.title}</h3>
          {course.subtitle && (
            <p className="text-sm text-ink opacity-75">{course.subtitle}</p>
          )}
        </div>
        <IconComponent size={32} className="text-ink" />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-paper border-2 border-ink rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-ink"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-sm mt-2">{progress}% complete</p>
    </motion.div>
  );
}

export default CourseCard;
```

## Common Patterns

### Fetching Data with Error Handling

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

function MyComponent() {
  const myServerFn = useServerFn(getMyDataServerFn);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["myData"],
    queryFn: myServerFn,
  });

  if (isLoading) return <Skeleton />;
  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );

  return <div>{/* Render data */}</div>;
}
```

### Mutation (Update Data)

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();
  const updateFn = useServerFn(updateDataServerFn);

  const mutation = useMutation({
    mutationFn: updateFn,
    onSuccess: () => {
      // Refetch data after update
      queryClient.invalidateQueries({ queryKey: ["myData"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ /* data */ })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Saving..." : "Save"}
    </button>
  );
}
```

## Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"

```bash
bun add @supabase/supabase-js
```

### Error: "Missing Supabase environment variables"

- Check that `.env.local` exists in the root directory
- Verify that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Error: "SUPABASE_SERVICE_ROLE_KEY is not defined" (on server)

- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- This key should **never** be exposed to the client

### Data not showing up

- Verify that you ran both `schema.sql` and `seed.sql` in Supabase
- Check the Supabase Table Editor to see if data exists
- Check browser console for errors

## Next Steps

1. ✅ Install dependencies
2. ✅ Set environment variables
3. ✅ Create database schema
4. ✅ Integrate routes with server functions
5. 🔄 **Add Authentication** (Supabase Auth)
6. 🔄 **Add Real-time Updates** (Supabase Realtime)
7. 🔄 **Deploy to Production**

---

For more help, see `backend/README.md` or check the [Supabase docs](https://supabase.com/docs).
