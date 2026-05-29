import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "./client";

/**
 * Middleware to require authentication on server functions
 * Validates the user's session and adds user ID to context
 */
export const requireSupabaseAuth = createServerFn({
  method: "POST",
})
  .middleware(async ({ next, context }) => {
    try {
      const supabase = getSupabaseServerClient();
      const authHeader = context.headers?.authorization;

      if (!authHeader) {
        throw new Error("No authorization header");
      }

      const token = authHeader.replace("Bearer ", "");

      // Verify the JWT token
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error("Invalid token");
      }

      // Add user to context
      context.user = user;
      context.userId = user.id;

      return next({ context });
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  })
  .handler(async ({ context }) => {
    return context;
  });

/**
 * Optional: Middleware for public endpoints that optionally include user info
 */
export const optionalSupabaseAuth = createServerFn({
  method: "POST",
})
  .middleware(async ({ next, context }) => {
    try {
      const supabase = getSupabaseServerClient();
      const authHeader = context.headers?.authorization;

      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
          context.user = user;
          context.userId = user.id;
        }
      }

      return next({ context });
    } catch (error) {
      // Silently fail for optional auth
      return next({ context });
    }
  })
  .handler(async ({ context }) => {
    return context;
  });
