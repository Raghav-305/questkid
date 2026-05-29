import { createServerFn } from "@tanstack/react-start";
import {
  getAllCourses,
  getUserCourses,
  updateCourseProgress,
  type Course,
} from "./queries/courses";
import {
  getAllBadges,
  getUserBadges,
  getBadgeStatus,
  awardBadge,
  type Badge,
  type UserBadge,
} from "./queries/badges";
import {
  getUserProfile,
  getLeaderboard,
  createUserProfile,
  updateUserProfile,
  addXP,
  type UserProfile,
} from "./queries/profiles";

type UserIdData = {
  userId: string;
};

// ============================================
// COURSES
// ============================================

/**
 * Server function: Get all courses (public)
 */
export const getAllCoursesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return getAllCourses();
});

/**
 * Server function: Get user's courses with progress
 */
export const getUserCoursesServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: UserIdData }) => {
  return getUserCourses(data.userId);
});

/**
 * Server function: Update course progress
 */
export const updateCourseProgressServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: { userId: string; courseId: string; progress: number } }) => {
  await updateCourseProgress(data.userId, data.courseId, data.progress);
  return { success: true };
});

// ============================================
// BADGES
// ============================================

/**
 * Server function: Get all badge definitions (public)
 */
export const getAllBadgesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return getAllBadges();
});

/**
 * Server function: Get user's unlocked badges
 */
export const getUserBadgesServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: UserIdData }) => {
  return getUserBadges(data.userId);
});

/**
 * Server function: Get badge unlock status (locked vs unlocked)
 */
export const getBadgeStatusServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: UserIdData }) => {
  return getBadgeStatus(data.userId);
});

/**
 * Server function: Award a badge to user
 */
export const awardBadgeServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: { userId: string; badgeId: string } }) => {
  await awardBadge(data.userId, data.badgeId);
  return { success: true };
});

// ============================================
// PROFILES
// ============================================

/**
 * Server function: Get user profile
 */
export const getUserProfileServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: UserIdData }) => {
  return getUserProfile(data.userId);
});

/**
 * Server function: Get leaderboard
 */
export const getLeaderboardServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return getLeaderboard(10);
});

/**
 * Server function: Create user profile (called on signup)
 */
export const createUserProfileServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      userId: string;
      displayName?: string;
      avatarEmoji?: string;
    };
  }) => {
    return createUserProfile(data.userId, data.displayName, data.avatarEmoji);
  },
);

/**
 * Server function: Update user profile
 */
export const updateUserProfileServerFn = createServerFn({
  method: "POST",
}).handler(
  async ({
    data,
  }: {
    data: {
      userId: string;
      updates: Partial<Omit<UserProfile, "id" | "created_at">>;
    };
  }) => {
    return updateUserProfile(data.userId, data.updates);
  },
);

/**
 * Server function: Add XP to user
 */
export const addXPServerFn = createServerFn({
  method: "POST",
}).handler(async ({ data }: { data: { userId: string; amount: number } }) => {
  const newXP = await addXP(data.userId, data.amount);
  return { newXP };
});
