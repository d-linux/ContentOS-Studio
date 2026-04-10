import { z } from "zod/v4";

export const sceneSchema = z.object({
  type: z.enum(["hook", "context", "value", "proof", "payoff", "cta"]),
  content: z.string(),
  textOnScreen: z.string(),
});

export const scriptOutputSchema = z.object({
  title: z.string(),
  scenes: z.array(sceneSchema).min(3).max(12),
});

export const captionOutputSchema = z.object({
  description: z.string(),
  hashtags: z.string(),
});

export const sceneRegenerationSchema = z.object({
  content: z.string(),
  textOnScreen: z.string(),
});

export type ScriptOutput = z.infer<typeof scriptOutputSchema>;
export type CaptionOutput = z.infer<typeof captionOutputSchema>;
export type SceneRegeneration = z.infer<typeof sceneRegenerationSchema>;
