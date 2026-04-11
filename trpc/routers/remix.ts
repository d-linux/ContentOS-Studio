import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, rateLimitedProcedure } from "../init";
import { scripts, scenes, brandBrains, users } from "@/db/schema";
import { generateScript } from "@/lib/ai/generate";
import { buildRemixPrompt, formatBrandBrain } from "@/lib/ai/prompts";

export const remixRouter = router({
  // ─── Remix a script for a different platform ──────────
  create: rateLimitedProcedure
    .input(
      z.object({
        sourceScriptId: z.string().uuid(),
        targetPlatform: z.enum(["youtube", "tiktok", "instagram"]),
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

      // Get source script
      const [sourceScript] = await ctx.db
        .select()
        .from(scripts)
        .where(
          and(
            eq(scripts.id, input.sourceScriptId),
            eq(scripts.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!sourceScript) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Source script not found",
        });
      }

      if (sourceScript.platform === input.targetPlatform) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Target platform must be different from the source.",
        });
      }

      // Get source scenes
      const sourceScenes = await ctx.db
        .select()
        .from(scenes)
        .where(eq(scenes.scriptId, sourceScript.id))
        .orderBy(scenes.order);

      // Get Brand Brain
      const [brandBrain] = await ctx.db
        .select()
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      const prompt = buildRemixPrompt({
        brandBrain: brandBrain ?? {},
        sourceScript: {
          title: sourceScript.title,
          platform: sourceScript.platform,
          scenes: sourceScenes.map((s) => ({
            type: s.type,
            content: s.content,
          })),
        },
        targetPlatform: input.targetPlatform,
      });

      const aiOutput = await generateScript(formatBrandBrain(brandBrain), prompt);

      // Save remixed script
      const [script] = await ctx.db
        .insert(scripts)
        .values({
          userId: ctx.user.id,
          title: aiOutput.title,
          mode: "remix",
          platform: input.targetPlatform,
          length: sourceScript.length,
          pace: sourceScript.pace,
          format: sourceScript.format,
          topicDescription: `Remix of "${sourceScript.title}" for ${input.targetPlatform}`,
          remixSourceId: sourceScript.id,
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
});
