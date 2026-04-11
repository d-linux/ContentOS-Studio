import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, rateLimitedProcedure } from "../init";
import { brandBrains, scripts, scenes, users } from "@/db/schema";
import { getTrendingVideos } from "@/lib/youtube";
import { generateScript } from "@/lib/ai/generate";
import { buildScriptPrompt, formatBrandBrain } from "@/lib/ai/prompts";

export const trendsRouter = router({
  // ─── Get trending topics matched to user's niche ──────
  getTopics: protectedProcedure
    .input(
      z
        .object({
          regionCode: z.string().length(2).default("US"),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const [brandBrain] = await ctx.db
        .select()
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      if (!brandBrain?.niche) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Set your niche in Brand Brain to see trending topics.",
        });
      }

      return getTrendingVideos(brandBrain.niche, input?.regionCode ?? "US");
    }),

  // ─── Generate script from a trending topic ────────────
  generateFromTrend: rateLimitedProcedure
    .input(
      z.object({
        trendTitle: z.string().min(1).max(500),
        trendDescription: z.string().max(2000).optional(),
        length: z.string().min(1).max(50),
        pace: z.enum(["slow", "medium", "fast"]),
        format: z.enum([
          "talking_head",
          "listicle",
          "storytime",
          "tutorial",
          "skit",
          "vlog",
          "review",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check usage limits
      const canGenerate =
        ctx.user.scriptsUsed < ctx.user.scriptsLimit ||
        ctx.user.extraCredits > 0;

      if (!canGenerate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Script generation limit reached. Upgrade your plan or purchase extra credits.",
        });
      }

      const [brandBrain] = await ctx.db
        .select()
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      if (!brandBrain) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Complete your Brand Brain before generating scripts.",
        });
      }

      const topicDescription = input.trendDescription
        ? `Trending topic: "${input.trendTitle}" — ${input.trendDescription}`
        : `Trending topic: "${input.trendTitle}"`;

      const prompt = buildScriptPrompt({
        brandBrain,
        topicDescription,
        platform: "youtube",
        length: input.length,
        pace: input.pace,
        format: input.format,
      });

      const aiOutput = await generateScript(formatBrandBrain(brandBrain), prompt);

      const [script] = await ctx.db
        .insert(scripts)
        .values({
          userId: ctx.user.id,
          title: aiOutput.title,
          mode: "trend",
          platform: "youtube",
          length: input.length,
          pace: input.pace,
          format: input.format,
          topicDescription,
        })
        .returning();

      await ctx.db.insert(scenes).values(
        aiOutput.scenes.map((scene, index) => ({
          scriptId: script.id,
          order: index + 1,
          type: scene.type,
          content: scene.content,
          textOnScreen: scene.textOnScreen,
        }))
      );

      // Deduct usage
      if (ctx.user.scriptsUsed < ctx.user.scriptsLimit) {
        await ctx.db
          .update(users)
          .set({
            scriptsUsed: ctx.user.scriptsUsed + 1,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));
      } else {
        await ctx.db
          .update(users)
          .set({
            extraCredits: ctx.user.extraCredits - 1,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));
      }

      return script;
    }),
});
