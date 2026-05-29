import { supabase } from "@/integrations/supabase/client";
import type { CourseWithProgress, Badge, UserProfile } from "@/lib/types";

export async function getPublicCourses(): Promise<CourseWithProgress[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }

  return (data || []).map((course) => ({
    ...course,
    progress: 0,
  }));
}

export async function getPublicBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch badges: ${error.message}`);
  }

  return data || [];
}

export async function getPublicLeaderboard(limit = 10): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch leaderboard: ${error.message}`);
  }

  return data || [];
}
