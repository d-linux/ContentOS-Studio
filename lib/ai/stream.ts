import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { scriptOutputSchema, type ScriptOutput } from "./schemas";

const anthropic = new Anthropic();
const SONNET = "claude-sonnet-4-5-20250929";

// Cached system prompt — same as generate.ts
const SYSTEM_PROMPT: Anthropic.Messages.TextBlockParam[] = [
  {
    type: "text",
    text: `You write short-form video scripts that go viral. You BECOME the creator's voice — amplified 20%. Their best day, every time.

RULES:
- 6th grade reading level. Short words. Simple sentences. A 12-year-old must understand it.
- Write for the EAR. Contractions always. Fragments are good. "Best part? Free." not "The best part is that it is free."
- Vary sentence length: long → short → medium. Never uniform.
- Text-on-screen ADDS info voice doesn't say. Never a transcript.
- Hook in under 2 seconds. Use: curiosity gap, pattern interrupt, self-identification, FOMO, or controlled outrage.
- One self-correction per script ("actually wait—" or "okay real talk"). Vary the phrasing every time — never repeat the same one.
- One genuine hot take per script. Take a stance.
- Ending connects to opening for replay value. Leave 5% unresolved or callback with new context.
- Optimise for SHARES, not just watches. Include one moment that makes someone think "I need to send this to someone."

NEVER SAY: "let's dive in", "in today's video", "buckle up", "without further ado", "stay tuned", "game-changer", "level up", "at the end of the day", "it's worth noting", "hey guys welcome back", "make sure to like and subscribe", "so basically"

EXAMPLE — 30s TikTok, tech niche, fast pace, talking head:
{
  "title": "The £3 app that replaced Notion",
  "scenes": [
    {"type": "hook", "content": "I deleted Notion. And I'm not going back.", "textOnScreen": "I deleted Notion."},
    {"type": "value", "content": "This app costs three quid. Three. And it does everything Notion does but it actually loads in under four seconds.", "textOnScreen": "Obsidian — £3 vs Notion £8/mo"},
    {"type": "proof", "content": "I moved 200 notes over last weekend. My daily journal, my content calendar, my client tracker. All of it. Took me two hours.", "textOnScreen": "200 notes migrated in 2 hours"},
    {"type": "cta", "content": "Save this before you renew your Notion subscription. You'll thank me.", "textOnScreen": "Link in bio"}
  ]
}

EXAMPLE — 15s Instagram Reel, fitness niche, fast pace, listicle:
{
  "title": "3 exercises you're doing wrong",
  "scenes": [
    {"type": "hook", "content": "Stop doing sit-ups. Right now.", "textOnScreen": "STOP doing sit-ups ❌"},
    {"type": "value", "content": "Dead bugs. Pallof press. Ab wheel. Three moves, ten minutes, actual results.", "textOnScreen": "1. Dead bugs 2. Pallof press 3. Ab wheel"},
    {"type": "cta", "content": "Send this to someone who still does crunches.", "textOnScreen": "Save for gym day 💪"}
  ]
}`,
    cache_control: { type: "ephemeral", ttl: "1h" },
  },
];

/**
 * Streams script generation text deltas via a ReadableStream.
 * Returns both the stream (for SSE to frontend) and a promise
 * that resolves with the final parsed output (for DB save).
 */
export function streamScriptGeneration(
  systemContext: string,
  prompt: string
): {
  stream: ReadableStream;
  result: Promise<ScriptOutput>;
} {
  const messageStream = anthropic.messages.stream({
    model: SONNET,
    max_tokens: 2048,
    system: [
      ...SYSTEM_PROMPT,
      {
        type: "text",
        text: systemContext,
        cache_control: { type: "ephemeral", ttl: "5m" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(scriptOutputSchema) },
  });

  const encoder = new TextEncoder();

  // Create a ReadableStream that emits SSE-formatted text deltas
  const readableStream = new ReadableStream({
    async start(controller) {
      messageStream.on("text", (textDelta) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "delta", text: textDelta })}\n\n`)
        );
      });

      messageStream.on("end", () => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      });

      messageStream.on("error", (error) => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`
          )
        );
        controller.close();
      });
    },
  });

  // The result promise resolves when the full message is available
  const result = messageStream.finalMessage().then((message) => {
    if (!message.parsed_output) {
      throw new Error("Failed to generate structured script output");
    }
    return message.parsed_output as ScriptOutput;
  });

  return { stream: readableStream, result };
}
