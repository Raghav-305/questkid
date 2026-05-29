import { getSupabaseServerClient } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  icon_name: string;
  bg_color: string;
  total_lessons: number;
  progress?: number; // Will be populated when fetching user progress
  created_at: string;
}

/**
 * Fetch all available courses
 */
export async function getAllCourses(): Promise<Course[]> {
  console.log("🚀 [getAllCourses] Starting...");
  
  const supabase = getSupabaseServerClient();
  console.log("✅ [getAllCourses] Supabase client created");

  try {
    console.log("📡 [getAllCourses] Querying 'courses' table...");
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ [getAllCourses] Supabase error:", error);
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    console.log("✅ [getAllCourses] Success! Found", data?.length || 0, "courses");
    console.log("📦 [getAllCourses] Data:", data);
    return data || [];
  } catch (err) {
    console.error("❌ [getAllCourses] Exception:", err);
    throw err;
  }
}

/**
 * Fetch user's course progress with course details
 */
export async function getUserCourses(userId: string): Promise<(Course & { progress: number })[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      user_course_progress!inner(progress)
    `
    )
    .eq("user_course_progress.user_id", userId);

  if (error) {
    console.error("Error fetching user courses:", error);
    throw new Error(`Failed to fetch user courses: ${error.message}`);
  }

  // Transform the data to flatten progress
  return (data || []).map((course: any) => ({
    ...course,
    progress: course.user_course_progress?.[0]?.progress || 0,
  }));
}

/**
 * Update user's course progress
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  progress: number
): Promise<void> {
  if (progress < 0 || progress > 100) {
    throw new Error("Progress must be between 0 and 100");
  }

  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("user_course_progress")
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        progress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_id" }
    );

  if (error) {
    console.error("Error updating course progress:", error);
    throw new Error(`Failed to update course progress: ${error.message}`);
  }
}
