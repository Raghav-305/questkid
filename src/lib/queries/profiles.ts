import { getSupabaseServerClient } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_emoji: string;
  xp: number;
  streak_days: number;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No profile found
      return null;
    }
    console.error("Error fetching user profile:", error);
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return data;
}

/**
 * Get top users for leaderboard
 */
export async function getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("xp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error(`Failed to fetch leaderboard: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new user profile (called after signup)
 */
export async function createUserProfile(
  userId: string,
  displayName?: string,
  avatarEmoji?: string
): Promise<UserProfile> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: displayName || `User_${userId.slice(0, 8)}`,
      avatar_emoji: avatarEmoji || "🚀",
      xp: 0,
      streak_days: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "id" | "created_at">>
): Promise<UserProfile> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }

  return data;
}

/**
 * Add XP to user
 */
export async function addXP(userId: string, amount: number): Promise<number> {
  const profile = await getUserProfile(userId);

  if (!profile) {
    throw new Error("User profile not found");
  }

  const newXP = profile.xp + amount;
  const updated = await updateUserProfile(userId, { xp: newXP });

  return updated.xp;
}

/**
 * Update user streak
 */
export async function updateStreak(userId: string, days: number): Promise<void> {
  await updateUserProfile(userId, {
    streak_days: days,
    last_activity_at: new Date().toISOString(),
  });
}
