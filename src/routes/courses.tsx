import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { CourseCard } from "@/components/CourseCard";
import { PageTransition } from "@/components/PageTransition";
import { getAllCoursesServerFn } from "@/lib/supabase.functions";
import { resolveIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "My Courses — QuestKid" },
      {
        name: "description",
        content: "Browse all your learning adventures and pick the next quest.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <PageTransition>
      <header className="brutal-card bg-sky p-8">
        <p className="text-xs font-black uppercase tracking-widest">All Adventures</p>
        <h1 className="mt-1 text-4xl font-black">My Courses</h1>
        <p className="mt-2 text-sm font-bold text-ink/70 max-w-lg">
          Pick a course, finish lessons, and earn shiny new badges along the way!
        </p>
      </header>

      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-paper border-4 border-ink rounded-2xl animate-pulse"
              />
            ))}
          </div>
        }
      >
        <CoursesContent />
      </Suspense>
    </PageTransition>
  );
}

function CoursesContent() {
  const getAllCourses = useServerFn(getAllCoursesServerFn);

  const {
    data: courses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      console.log("🔍 [Courses] Starting fetch...");
      try {
        const result = await getAllCourses();
        console.log("✅ [Courses] Fetched successfully:", result);
        return result;
      } catch (err) {
        console.error("❌ [Courses] Fetch error:", err);
        throw err;
      }
    },
  });

  console.log("📊 [Courses] State:", { isLoading, error, coursesCount: courses.length });

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-paper border-4 border-ink rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    console.error("❌ Error loading courses:", error);
    return (
      <div className="p-6 bg-coral/20 border-4 border-coral rounded-2xl">
        <h3 className="font-bold text-red-600">Error Loading Courses</h3>
        <p className="text-sm mt-2">{String(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-coral border-2 border-ink rounded-lg font-bold hover:scale-105 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-6 bg-banana/20 border-4 border-banana rounded-2xl">
        <h3 className="font-bold">No courses found</h3>
        <p className="text-sm mt-2">Make sure your Supabase database has seed data.</p>
        <p className="text-xs mt-4 text-gray-600">Check browser console for debug logs.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          title={course.title}
          subtitle={course.subtitle ?? ""}
          progress={course.progress || 0}
          Icon={resolveIcon(course.icon_name)}
          bgColor={course.bg_color}
          lessons={course.total_lessons}
        />
      ))}
    </div>
  );
}
