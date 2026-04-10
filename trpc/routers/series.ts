import { z } from "zod/v4";
import { eq, and, desc, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, rateLimitedProcedure } from "../init";
import { series, scripts, scenes, brandBrains, users } from "@/db/schema";
import { generateScript } from "@/lib/ai/generate";
import { buildSeriesEpisodePrompt } from "@/lib/ai/prompts";

export const seriesRouter = router({
  // ─── List all series for the current user ─────────────
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(series)
      .where(eq(series.userId, ctx.user.id))
      .orderBy(desc(series.createdAt));
  }),

  // ─── Get a series with its scripts ────────────────────
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [seriesRecord] = await ctx.db
        .select()
        .from(series)
        .where(and(eq(series.id, input.id), eq(series.userId, ctx.user.id)))
        .limit(1);

      if (!seriesRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Series not found",
        });
      }

      const seriesScripts = await ctx.db
        .select()
        .from(scripts)
        .where(eq(scripts.seriesId, seriesRecord.id))
        .orderBy(asc(scripts.episodeNumber));

      return { ...seriesRecord, scripts: seriesScripts };
    }),

  // ─── Create a series ──────────────────────────────────
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        connectionMode: z.enum([
          "sequential",
          "anthology",
          "running_format",
          "journey",
          "response",
        ]),
        platform: z.enum(["youtube", "tiktok", "instagram"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(series)
        .values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          connectionMode: input.connectionMode,
          platform: input.platform,
        })
        .returning();

      return created;
    }),

  // ─── Generate next episode ────────────────────────────
  generateEpisode: rateLimitedProcedure
    .input(
      z.object({
        seriesId: z.string().uuid(),
        topicDescription: z.string().min(1).max(2000),
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

      // Get series
      const [seriesRecord] = await ctx.db
        .select()
        .from(series)
        .where(
          and(eq(series.id, input.seriesId), eq(series.userId, ctx.user.id))
        )
        .limit(1);

      if (!seriesRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Series not found",
        });
      }

      // Get Brand Brain
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

      // Get previous episodes with their scenes for context chaining
      const previousScripts = await ctx.db
        .select()
        .from(scripts)
        .where(eq(scripts.seriesId, seriesRecord.id))
        .orderBy(asc(scripts.episodeNumber));

      const previousEpisodes = await Promise.all(
        previousScripts.map(async (script) => {
          const episodeScenes = await ctx.db
            .select()
            .from(scenes)
            .where(eq(scenes.scriptId, script.id))
            .orderBy(scenes.order);

          return {
            episodeNumber: script.episodeNumber ?? 0,
            title: script.title,
            scenes: episodeScenes.map((s) => ({
              type: s.type,
              content: s.content,
            })),
          };
        })
      );

      const episodeNumber = previousScripts.length + 1;

      // Generate via AI with full series context
      const prompt = buildSeriesEpisodePrompt({
        brandBrain,
        seriesTitle: seriesRecord.title,
        connectionMode: seriesRecord.connectionMode,
        episodeNumber,
        previousEpisodes,
        topicDescription: input.topicDescription,
        platform: seriesRecord.platform,
        length: input.length,
        pace: input.pace,
        format: input.format,
      });

      const aiOutput = await generateScript(prompt);

      // Save script
      const [script] = await ctx.db
        .insert(scripts)
        .values({
          userId: ctx.user.id,
          seriesId: seriesRecord.id,
          title: aiOutput.title,
          mode: "series",
          platform: seriesRecord.platform,
          length: input.length,
          pace: input.pace,
          format: input.format,
          topicDescription: input.topicDescription,
          episodeNumber,
        })
        .returning();

      // Save scenes
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

  // ─── Delete a series (cascades to scripts via seriesId set null) ─
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [seriesRecord] = await ctx.db
        .select({ id: series.id })
        .from(series)
        .where(and(eq(series.id, input.id), eq(series.userId, ctx.user.id)))
        .limit(1);

      if (!seriesRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Series not found",
        });
      }

      await ctx.db.delete(series).where(eq(series.id, input.id));
      return { success: true };
    }),
});
