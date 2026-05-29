import { getSupabaseServerClient } from "@/integrations/supabase/client";

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  color: string;
  created_at: string;
}

export interface UserBadge extends Badge {
  unlocked_at: string;
}

/**
 * Fetch all available badge definitions
 */
export async function getAllBadges(): Promise<Badge[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching badges:", error);
    throw new Error(`Failed to fetch badges: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch user's unlocked badges
 */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_badges")
    .select(
      `
      badge_id,
      unlocked_at,
      badges(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user badges:", error);
    throw new Error(`Failed to fetch user badges: ${error.message}`);
  }

  return (data || []).map((item: any) => ({
    ...item.badges,
    unlocked_at: item.unlocked_at,
  }));
}

/**
 * Get badge unlock status for a user
 * Returns which badges are locked vs unlocked
 */
export async function getBadgeStatus(userId: string): Promise<{
  unlocked: Badge[];
  locked: Badge[];
}> {
  const supabase = getSupabaseServerClient();

  // Get all badges
  const { data: allBadges, error: badgesError } = await supabase
    .from("badges")
    .select("*");

  if (badgesError) {
    throw new Error(`Failed to fetch badges: ${badgesError.message}`);
  }

  // Get unlocked badges
  const { data: unlockedData, error: unlockedError } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  if (unlockedError) {
    throw new Error(`Failed to fetch user badges: ${unlockedError.message}`);
  }

  const unlockedIds = new Set((unlockedData || []).map((item: any) => item.badge_id));

  const unlocked = (allBadges || []).filter((badge: any) => unlockedIds.has(badge.id));
  const locked = (allBadges || []).filter((badge: any) => !unlockedIds.has(badge.id));

  return { unlocked, locked };
}

/**
 * Award a badge to a user
 */
export async function awardBadge(userId: string, badgeId: string): Promise<void> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badgeId,
    unlocked_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error awarding badge:", error);
    throw new Error(`Failed to award badge: ${error.message}`);
  }
}
