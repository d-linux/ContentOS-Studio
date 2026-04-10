import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../init";
import { brandBrains, users } from "@/db/schema";

const brandBrainInput = z.object({
  name: z.string().max(100).optional(),
  tone: z.string().max(500).optional(),
  niche: z.string().max(500).optional(),
  about: z.string().max(2000).optional(),
  boundaries: z.string().max(1000).optional(),
});

export const brandBrainRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [brandBrain] = await ctx.db
      .select()
      .from(brandBrains)
      .where(eq(brandBrains.userId, ctx.user.id))
      .limit(1);

    return brandBrain ?? null;
  }),

  upsert: protectedProcedure
    .input(brandBrainInput)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select({ id: brandBrains.id })
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        const [updated] = await ctx.db
          .update(brandBrains)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(brandBrains.userId, ctx.user.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(brandBrains)
        .values({ userId: ctx.user.id, ...input })
        .returning();

      // Mark onboarding as complete when Brand Brain is first created
      await ctx.db
        .update(users)
        .set({ onboardingComplete: true, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));

      return created;
    }),
});
