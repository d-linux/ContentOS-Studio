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

// Haiku 4.5 — fastest model, structured output capable, sub-10s generations
const MODEL = "claude-haiku-4-5-20251001";

// System prompt cached for repeat requests — saves ~30% latency
const SCRIPT_SYSTEM_PROMPT: Anthropic.Messages.TextBlockParam[] = [
  {
    type: "text",
    text: `You are a veteran short-form video scriptwriter who has written for creators with millions of followers. You write scripts that sound like a real person talking to their audience — not an AI.

RULES — violating any of these makes the script unusable:

1. NEVER use these AI cliches: "let's dive in", "in today's video", "buckle up", "without further ado", "stay tuned", "here's the thing", "game-changer", "level up", "at the end of the day", "it's worth noting", "in this digital age", "unlock your potential", "journey", "navigate"
2. NEVER start two consecutive scenes with the same sentence structure
3. NEVER use rhetorical questions as filler — every question must be one the audience is actually thinking
4. Vary scene lengths — some scenes are 2 sentences, some are 5. Uniform length = robotic
5. Write spoken language, not written language. Use contractions, fragments, interruptions. People don't speak in perfect grammar.
6. The hook must create an open loop or pattern interrupt in under 2 seconds of speech
7. Each scene's text-on-screen should add information the voice DOESN'T say — never repeat the spoken words
8. End with a CTA that feels like advice from a friend, not a sales pitch`,
    cache_control: { type: "ephemeral", ttl: "1h" },
  },
];

const CAPTION_SYSTEM_PROMPT: Anthropic.Messages.TextBlockParam[] = [
  {
    type: "text",
    text: `You write social media captions that drive engagement. Write like a creator, not a marketer. No corporate tone. Captions should feel like something the creator would actually type — casual, punchy, with personality. Hashtags should mix broad reach tags with niche-specific ones.`,
    cache_control: { type: "ephemeral", ttl: "1h" },
  },
];

export async function generateScript(
  systemContext: string,
  prompt: string
): Promise<ScriptOutput> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 2048,
    system: [
      ...SCRIPT_SYSTEM_PROMPT,
      {
        type: "text",
        text: systemContext,
        cache_control: { type: "ephemeral", ttl: "5m" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(scriptOutputSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to generate structured script output");
  }

  return response.parsed_output;
}

export async function generateCaption(
  systemContext: string,
  prompt: string
): Promise<CaptionOutput> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 512,
    system: [
      ...CAPTION_SYSTEM_PROMPT,
      {
        type: "text",
        text: systemContext,
        cache_control: { type: "ephemeral", ttl: "5m" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(captionOutputSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to generate caption output");
  }

  return response.parsed_output;
}

export async function regenerateScene(
  systemContext: string,
  prompt: string
): Promise<SceneRegeneration> {
  const response = await anthropic.messages.parse({
    model: MODEL,
    max_tokens: 512,
    system: [
      ...SCRIPT_SYSTEM_PROMPT,
      {
        type: "text",
        text: systemContext,
        cache_control: { type: "ephemeral", ttl: "5m" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(sceneRegenerationSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to regenerate scene output");
  }

  return response.parsed_output;
}
