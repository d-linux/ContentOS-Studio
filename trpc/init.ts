import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createTRPCContext(opts: { headers: Headers }) {
  const { userId: clerkId } = await auth();

  return {
    db,
    clerkId,
    headers: opts.headers,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;

// Public procedure — no auth required
export const publicProcedure = t.procedure;

// Authed procedure — requires Clerk authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.clerkId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Look up the internal user from clerkId
  const [user] = await ctx.db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkId))
    .limit(1);

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

// Rate-limited procedure — authed + rate limited
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
});

export const rateLimitedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const { success } = await ratelimit.limit(ctx.user.id);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Try again later.",
      });
    }

    return next();
  }
);
