/**
 * QuestKid Database Types
 * 
 * TypeScript types for all database entities.
 * Generated from Supabase schema.
 */

// ============================================
// Courses
// ============================================

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  icon_name: string; // Lucide React icon name (e.g., 'Rocket')
  bg_color: string; // Tailwind color class (e.g., 'bg-sky')
  total_lessons: number;
  created_at: string; // ISO timestamp
}

export interface UserCourseProgress {
  user_id: string;
  course_id: string;
  progress: number; // 0-100
  updated_at: string; // ISO timestamp
}

export type CourseWithProgress = Course & {
  progress: number;
};

// ============================================
// Badges
// ============================================

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_name: string; // Lucide React icon name
  color: string; // Tailwind color class
  created_at: string; // ISO timestamp
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  unlocked_at: string; // ISO timestamp
}

export type BadgeWithUnlockStatus = Badge & {
  unlocked_at?: string; // Only present if unlocked
};

// ============================================
// Profiles
// ============================================

export interface UserProfile {
  id: string; // References auth.users.id
  display_name: string | null;
  avatar_emoji: string;
  xp: number;
  streak_days: number;
  last_activity_at: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

// ============================================
// Component Props
// ============================================

export interface CourseCardProps {
  course: CourseWithProgress;
  onProgressChange?: (progress: number) => void;
}

export interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  onClick?: () => void;
}

export interface LeaderboardRowProps {
  user: UserProfile;
  rank: number;
}

export interface PodiumProps {
  users: UserProfile[]; // Should be top 3 users
}

export interface QuestTrackerProps {
  activities: Activity[];
}

export interface Activity {
  date: string; // YYYY-MM-DD
  count: number; // Lessons completed
  intensity?: "low" | "medium" | "high";
}

// ============================================
// Form Data Types
// ============================================

export interface UpdateProfileFormData {
  display_name?: string;
  avatar_emoji?: string;
}

export interface CreateCourseFormData {
  title: string;
  subtitle?: string;
  icon_name: string;
  bg_color: string;
  total_lessons: number;
}

// ============================================
// Filter & Sort Types
// ============================================

export type SortBy = "xp" | "streak" | "name" | "recent";
export type CourseFilter = "all" | "in-progress" | "completed";

// ============================================
// Pagination
// ============================================

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Query States
// ============================================

export interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================
// Authentication
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}
