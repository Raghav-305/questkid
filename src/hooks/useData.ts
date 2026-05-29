/**
 * useAuth Hook
 *
 * Custom hook for managing authentication state.
 * Works with Supabase Auth.
 */

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser } from "@/lib/types";

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error);
      }
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          user_metadata: session.user.user_metadata,
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          user_metadata: session.user.user_metadata,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    signOut,
    isAuthenticated: !!user,
  };
}

/**
 * useProfile Hook
 *
 * Fetches the current user's profile from Supabase.
 */

import { getUserProfileServerFn } from "@/lib/supabase.functions";
import { useServerFn } from "@tanstack/react-start";
import type { UserProfile } from "@/lib/types";

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProfile(userId: string | null): UseProfileReturn {
  const getUserProfile = useServerFn(getUserProfileServerFn);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      return getUserProfile({ data: { userId } });
    },
    enabled: !!userId,
  });

  return {
    profile: data || null,
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => refetch().then(() => {}),
  };
}

/**
 * useUserCourses Hook
 *
 * Fetches the current user's courses with progress.
 */

import { getUserCoursesServerFn } from "@/lib/supabase.functions";
import type { CourseWithProgress } from "@/lib/types";

interface useUserCoursesReturn {
  courses: CourseWithProgress[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserCourses(userId: string | null): useUserCoursesReturn {
  const getUserCourses = useServerFn(getUserCoursesServerFn);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userCourses", userId],
    queryFn: async () => {
      if (!userId) return [];
      return getUserCourses({ data: { userId } });
    },
    enabled: !!userId,
  });

  return {
    courses: data || [],
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => refetch().then(() => {}),
  };
}

/**
 * useUserBadges Hook
 *
 * Fetches the current user's badges.
 */

import { getUserBadgesServerFn } from "@/lib/supabase.functions";
import type { Badge } from "@/lib/types";

interface useUserBadgesReturn {
  badges: Badge[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserBadges(userId: string | null): useUserBadgesReturn {
  const getUserBadges = useServerFn(getUserBadgesServerFn);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userBadges", userId],
    queryFn: async () => {
      if (!userId) return [];
      return getUserBadges({ data: { userId } });
    },
    enabled: !!userId,
  });

  return {
    badges: data || [],
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => refetch().then(() => {}),
  };
}

/**
 * useLeaderboard Hook
 *
 * Fetches the global leaderboard.
 */

import { getLeaderboardServerFn } from "@/lib/supabase.functions";
import type { UserProfile } from "@/lib/types";

interface useLeaderboardReturn {
  users: UserProfile[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLeaderboard(): useLeaderboardReturn {
  const getLeaderboard = useServerFn(getLeaderboardServerFn);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  return {
    users: data || [],
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => refetch().then(() => {}),
  };
}
