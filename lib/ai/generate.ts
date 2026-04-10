import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import {
  scriptOutputSchema,
  captionOutputSchema,
  sceneRegenerationSchema,
  type ScriptOutput,
  type CaptionOutput,
  type SceneRegeneration,
} from "./schemas";

const anthropic = new Anthropic();

const MODEL = "claude-sonnet-4-5-20250929";

export async function generateScript(prompt: string): Promise<ScriptOutput> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(scriptOutputSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to generate structured script output");
  }

  return response.parsed_output;
}

export async function generateCaption(prompt: string): Promise<CaptionOutput> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(captionOutputSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to generate caption output");
  }

  return response.parsed_output;
}

export async function regenerateScene(
  prompt: string
): Promise<SceneRegeneration> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(sceneRegenerationSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to regenerate scene output");
  }

  return response.parsed_output;
}
