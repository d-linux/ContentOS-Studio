import { z } from "zod/v4";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, rateLimitedProcedure } from "../init";
import {
  scripts,
  scenes,
  scriptCaptions,
  brandBrains,
  users,
} from "@/db/schema";
import {
  generateScript,
  generateCaption,
  regenerateScene,
} from "@/lib/ai/generate";
import {
  buildScriptPrompt,
  buildSceneRegenerationPrompt,
  buildCaptionPrompt,
  formatBrandBrain,
} from "@/lib/ai/prompts";

export const scriptRouter = router({
  // ─── List all scripts for the current user ─────────────
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(scripts)
      .where(eq(scripts.userId, ctx.user.id))
      .orderBy(desc(scripts.createdAt));
  }),

  // ─── Get a single script with scenes + caption ────────
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [script] = await ctx.db
        .select()
        .from(scripts)
        .where(and(eq(scripts.id, input.id), eq(scripts.userId, ctx.user.id)))
        .limit(1);

      if (!script) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Script not found" });
      }

      const scriptScenes = await ctx.db
        .select()
        .from(scenes)
        .where(eq(scenes.scriptId, script.id))
        .orderBy(scenes.order);

      const [caption] = await ctx.db
        .select()
        .from(scriptCaptions)
        .where(eq(scriptCaptions.scriptId, script.id))
        .limit(1);

      return { ...script, scenes: scriptScenes, caption: caption ?? null };
    }),

  // ─── Create a script (Own Idea mode) ──────────────────
  create: rateLimitedProcedure
    .input(
      z.object({
        topicDescription: z.string().min(1).max(2000),
        platform: z.enum(["youtube", "tiktok", "instagram"]),
        length: z.enum(["15s", "30s", "60s"]),
        pace: z.enum(["normal", "medium", "fast"]),
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

      // Get Brand Brain context
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

      // Generate script via AI
      const prompt = buildScriptPrompt({
        brandBrain,
        topicDescription: input.topicDescription,
        platform: input.platform,
        length: input.length,
        pace: input.pace,
        format: input.format,
      });

      const aiOutput = await generateScript(formatBrandBrain(brandBrain), prompt);

      // Save script
      const [script] = await ctx.db
        .insert(scripts)
        .values({
          userId: ctx.user.id,
          title: aiOutput.title,
          mode: "own_idea",
          platform: input.platform,
          length: input.length,
          pace: input.pace,
          format: input.format,
          topicDescription: input.topicDescription,
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

  // ─── Delete a script ──────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [script] = await ctx.db
        .select({ id: scripts.id })
        .from(scripts)
        .where(and(eq(scripts.id, input.id), eq(scripts.userId, ctx.user.id)))
        .limit(1);

      if (!script) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Script not found" });
      }

      await ctx.db.delete(scripts).where(eq(scripts.id, input.id));
      return { success: true };
    }),

  // ─── Regenerate a single scene (1x per scene) ────────
  regenerateScene: rateLimitedProcedure
    .input(
      z.object({
        scriptId: z.string().uuid(),
        sceneId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify script ownership
      const [script] = await ctx.db
        .select()
        .from(scripts)
        .where(
          and(eq(scripts.id, input.scriptId), eq(scripts.userId, ctx.user.id))
        )
        .limit(1);

      if (!script) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Script not found" });
      }

      // Get the scene to regenerate
      const [scene] = await ctx.db
        .select()
        .from(scenes)
        .where(
          and(eq(scenes.id, input.sceneId), eq(scenes.scriptId, input.scriptId))
        )
        .limit(1);

      if (!scene) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Scene not found" });
      }

      if (scene.isRegenerated) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This scene has already been regenerated.",
        });
      }

      // Get all scenes for context
      const allScenes = await ctx.db
        .select()
        .from(scenes)
        .where(eq(scenes.scriptId, input.scriptId))
        .orderBy(scenes.order);

      // Get Brand Brain
      const [brandBrain] = await ctx.db
        .select()
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      const prompt = buildSceneRegenerationPrompt({
        brandBrain: brandBrain ?? {},
        scriptTitle: script.title,
        platform: script.platform,
        length: script.length,
        pace: script.pace,
        format: script.format,
        scene: { type: scene.type, content: scene.content, order: scene.order },
        allScenes: allScenes.map((s) => ({
          type: s.type,
          content: s.content,
          order: s.order,
        })),
      });

      const aiOutput = await regenerateScene(formatBrandBrain(brandBrain ?? {}), prompt);

      // Update scene — save original, replace content
      const [updated] = await ctx.db
        .update(scenes)
        .set({
          originalContent: scene.content,
          content: aiOutput.content,
          textOnScreen: aiOutput.textOnScreen,
          isRegenerated: true,
        })
        .where(eq(scenes.id, input.sceneId))
        .returning();

      return updated;
    }),

  // ─── Edit a scene manually ────────────────────────────
  editScene: protectedProcedure
    .input(
      z.object({
        scriptId: z.string().uuid(),
        sceneId: z.string().uuid(),
        content: z.string().min(1).max(5000),
        textOnScreen: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const [script] = await ctx.db
        .select({ id: scripts.id })
        .from(scripts)
        .where(
          and(eq(scripts.id, input.scriptId), eq(scripts.userId, ctx.user.id))
        )
        .limit(1);

      if (!script) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Script not found" });
      }

      const [updated] = await ctx.db
        .update(scenes)
        .set({
          content: input.content,
          ...(input.textOnScreen !== undefined && {
            textOnScreen: input.textOnScreen,
          }),
        })
        .where(
          and(eq(scenes.id, input.sceneId), eq(scenes.scriptId, input.scriptId))
        )
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Scene not found" });
      }

      return updated;
    }),

  // ─── Generate caption (description + hashtags) ────────
  generateCaption: rateLimitedProcedure
    .input(z.object({ scriptId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [script] = await ctx.db
        .select()
        .from(scripts)
        .where(
          and(eq(scripts.id, input.scriptId), eq(scripts.userId, ctx.user.id))
        )
        .limit(1);

      if (!script) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Script not found" });
      }

      const scriptScenes = await ctx.db
        .select()
        .from(scenes)
        .where(eq(scenes.scriptId, script.id))
        .orderBy(scenes.order);

      const [brandBrain] = await ctx.db
        .select()
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      const prompt = buildCaptionPrompt({
        scriptTitle: script.title,
        platform: script.platform,
        format: script.format,
        length: script.length,
        scenes: scriptScenes.map((s) => ({
          type: s.type,
          content: s.content,
        })),
        brandBrain: brandBrain ?? {},
      });

      const aiOutput = await generateCaption(formatBrandBrain(brandBrain ?? {}), prompt);

      // Upsert caption
      const existing = await ctx.db
        .select({ id: scriptCaptions.id })
        .from(scriptCaptions)
        .where(eq(scriptCaptions.scriptId, script.id))
        .limit(1);

      if (existing.length > 0) {
        const [updated] = await ctx.db
          .update(scriptCaptions)
          .set({
            description: aiOutput.description,
            hashtags: aiOutput.hashtags,
          })
          .where(eq(scriptCaptions.scriptId, script.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(scriptCaptions)
        .values({
          scriptId: script.id,
          description: aiOutput.description,
          hashtags: aiOutput.hashtags,
        })
        .returning();

      return created;
    }),

  // ─── Get voiceover (all scenes as one paragraph) ──────
  getVoiceover: protectedProcedure
    .input(z.object({ scriptId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [script] = await ctx.db
        .select({ id: scripts.id })
        .from(scripts)
        .where(
          and(eq(scripts.id, input.scriptId), eq(scripts.userId, ctx.user.id))
        )
        .limit(1);

      if (!script) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Script not found" });
      }

      const scriptScenes = await ctx.db
        .select({ content: scenes.content })
        .from(scenes)
        .where(eq(scenes.scriptId, script.id))
        .orderBy(scenes.order);

      return {
        voiceover: scriptScenes.map((s) => s.content).join(" "),
      };
    }),
});
