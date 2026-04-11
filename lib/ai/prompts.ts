interface BrandBrainContext {
  name?: string | null;
  tone?: string | null;
  niche?: string | null;
  about?: string | null;
  boundaries?: string | null;
  youtubeData?: unknown;
}

interface ScriptGenerationParams {
  brandBrain: BrandBrainContext;
  topicDescription: string;
  platform: string;
  length: string;
  pace: string;
  format: string;
}

interface SeriesEpisodeParams extends ScriptGenerationParams {
  seriesTitle: string;
  connectionMode: string;
  episodeNumber: number;
  previousEpisodes: Array<{
    episodeNumber: number;
    title: string;
    scenes: Array<{ type: string; content: string }>;
  }>;
}

interface RemixParams {
  brandBrain: BrandBrainContext;
  sourceScript: {
    title: string;
    platform: string;
    scenes: Array<{ type: string; content: string }>;
  };
  targetPlatform: string;
}

interface SceneRegenerationParams {
  brandBrain: BrandBrainContext;
  scriptTitle: string;
  platform: string;
  scene: {
    type: string;
    content: string;
    order: number;
  };
  allScenes: Array<{ type: string; content: string; order: number }>;
}

interface CaptionParams {
  scriptTitle: string;
  platform: string;
  scenes: Array<{ type: string; content: string }>;
  brandBrain: BrandBrainContext;
}

// ─── Brand Brain → system context (cached separately) ───

export function formatBrandBrain(bb: BrandBrainContext): string {
  const parts: string[] = [];
  if (bb.name) parts.push(`Creator: ${bb.name}`);
  if (bb.tone) parts.push(`Voice: ${bb.tone}`);
  if (bb.niche) parts.push(`Niche: ${bb.niche}`);
  if (bb.about) parts.push(`Background: ${bb.about}`);
  if (bb.boundaries)
    parts.push(`Hard boundaries (NEVER violate): ${bb.boundaries}`);
  if (bb.youtubeData)
    parts.push(
      `Past YouTube performance data (use to inform what works): ${JSON.stringify(bb.youtubeData)}`
    );
  return parts.length > 0
    ? `## Creator Profile\n${parts.join("\n")}`
    : "No creator profile yet — write in a natural, conversational voice.";
}

// ─── Platform voice guides ───

const PLATFORM_VOICE: Record<string, string> = {
  youtube: `YouTube voice rules:
- Structured but conversational — viewers chose to click, so reward that choice fast
- First 3 seconds decide if they stay. No warm-up, no intro music description, no "hey guys"
- Pacing: vary between quick-fire delivery and deliberate pauses for emphasis
- Speak like you're explaining something to a smart friend, not lecturing
- End with a CTA that ties back to the video's value, not a generic "like and subscribe"`,

  tiktok: `TikTok voice rules:
- Raw, unfiltered energy — sound like you're telling your group chat something wild
- First word must hook. Not "so" or "okay" — start mid-thought like they walked into a conversation
- Short punchy sentences. Fragments are fine. One idea per breath.
- Text on screen carries half the storytelling — use it for stats, punchlines, context the voice skips
- No formal CTAs — end on a cliffhanger, hot take, or "try this and tell me what happens"`,

  instagram: `Instagram Reels voice rules:
- Polished but personal — like a well-edited voice note to someone you respect
- Visual-first: text on screen does heavy lifting, voice adds personality and context
- Hook with a bold claim or relatable frustration — "nobody talks about this" energy
- Concise — say it in 3 words if you can, not 10
- CTA should feel like sharing insider knowledge: "save this for later" or "send this to someone who needs it"`,
};

// ─── Connection mode instructions for series ───

const CONNECTION_MODE_INSTRUCTIONS: Record<string, string> = {
  sequential:
    "SEQUENTIAL series: each episode continues the story. End with a cliffhanger or open question. Start episode 2+ with a quick callback (not a full recap — one line that re-hooks).",
  anthology:
    "ANTHOLOGY series: same theme, standalone episodes. Each works alone but feels part of a collection. Vary the angle — don't repeat the same structure.",
  running_format:
    "RUNNING FORMAT series: same recognizable structure every time, fresh content. Think of it like a show segment — the frame stays, the content changes. Lean into the ritual.",
  journey:
    "JOURNEY series: track real progress. Reference specific past milestones naturally — 'remember when I said X? Here's what happened.' Show genuine growth, not manufactured arcs.",
  response:
    "RESPONSE series: scripts that feel like replies to the audience. Reference real patterns in comments/DMs — 'a lot of you asked about X' or 'someone said Y and honestly...' Make viewers feel heard.",
};

// ─── Prompt builders ───

export function buildScriptPrompt(params: ScriptGenerationParams): string {
  const platformGuide =
    PLATFORM_VOICE[params.platform] || PLATFORM_VOICE.youtube;

  return `Write a ${params.format} script about: ${params.topicDescription}

${platformGuide}

Specs: ${params.platform} | ${params.length} | ${params.pace} pace

Scene structure: hook → context → value → proof → payoff → CTA
- You can use 3-8 scenes. Not every script needs all 6 types — merge or skip if the content flows better without forcing a scene.
- Hook: pattern interrupt or open loop. Under 2 seconds of speech. Make them unable to scroll.
- Context: why this matters NOW, to THIS audience. Ground it in something real.
- Value: the actual insight, tip, or story beat. Be specific — vague advice = skip.
- Proof: evidence, personal experience, data, or example. Show, don't tell.
- Payoff: the "aha" moment. Land the point in a way that feels earned.
- CTA: natural close. What should they do, think, or feel next?

Each scene needs:
- "content": what the creator actually says (spoken language, not essay prose)
- "textOnScreen": visual text that ADDS info the voice doesn't say — stats, labels, emphasis, never a transcript`;
}

export function buildSeriesEpisodePrompt(params: SeriesEpisodeParams): string {
  const platformGuide =
    PLATFORM_VOICE[params.platform] || PLATFORM_VOICE.youtube;

  const modeInstruction =
    CONNECTION_MODE_INSTRUCTIONS[params.connectionMode] || "";

  const previousContext =
    params.previousEpisodes.length > 0
      ? params.previousEpisodes
          .map(
            (ep) =>
              `Ep ${ep.episodeNumber} "${ep.title}": ${ep.scenes.map((s) => `[${s.type}] ${s.content}`).join(" | ")}`
          )
          .join("\n")
      : "First episode — establish the tone and hook that will carry the series.";

  return `Write episode ${params.episodeNumber} of "${params.seriesTitle}".

Topic for this episode: ${params.topicDescription}

${modeInstruction}

${platformGuide}

Specs: ${params.platform} | ${params.length} | ${params.pace} pace | ${params.format}

## Previous episodes (for continuity)
${previousContext}

Scene structure: hook → context → value → proof → payoff → CTA
- Reference previous episodes only where it serves the story — don't force callbacks
- Each episode must stand strong on its own while rewarding returning viewers
- The hook should work for both new and returning viewers

Each scene needs "content" (spoken) and "textOnScreen" (visual, never a transcript of the voice).`;
}

export function buildRemixPrompt(params: RemixParams): string {
  const originalScenes = params.sourceScript.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const targetGuide =
    PLATFORM_VOICE[params.targetPlatform] || PLATFORM_VOICE.youtube;

  return `Remix this script for ${params.targetPlatform}. This is NOT a copy-paste reformat — it's a creative reimagining.

## Source (${params.sourceScript.platform})
"${params.sourceScript.title}"
${originalScenes}

## Target: ${params.targetPlatform}
${targetGuide}

What to keep: the core insight, the creator's personality, the value proposition.
What to change: structure, pacing, language, hook style, CTA style — everything that makes a ${params.sourceScript.platform} script feel wrong on ${params.targetPlatform}.

A good remix should make someone think "this was made for ${params.targetPlatform}" — not "this was adapted from somewhere else."

Each scene needs "content" (spoken) and "textOnScreen" (visual, adds info the voice doesn't say).`;
}

export function buildSceneRegenerationPrompt(
  params: SceneRegenerationParams
): string {
  const contextScenes = params.allScenes
    .filter((s) => s.order !== params.scene.order)
    .map((s) => `[Scene ${s.order} — ${s.type}]: ${s.content}`)
    .join("\n");

  return `Rewrite scene ${params.scene.order} (${params.scene.type}) of "${params.scriptTitle}" (${params.platform}).

## Current version (replace this entirely)
"${params.scene.content}"

## Surrounding scenes (for tone/flow consistency)
${contextScenes}

Write a meaningfully different take — not a synonym swap. Change the angle, the example, or the framing. Keep the same scene type (${params.scene.type}) and make it fit naturally between the surrounding scenes.

Return "content" (spoken) and "textOnScreen" (visual, adds info — not a transcript).`;
}

export function buildCaptionPrompt(params: CaptionParams): string {
  const sceneSummary = params.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  return `Write a ${params.platform} caption for "${params.scriptTitle}".

## Script content
${sceneSummary}

Caption rules:
- Open with a hook line that makes people stop scrolling and read
- Write like the creator talks — match their voice, not marketing copy
- Include one clear call-to-action (comment prompt, save prompt, or share prompt)
- Keep it under 150 words — punchy beats long

Hashtags:
- 15-20 hashtags, space-separated
- Mix: 5 broad reach (#content #creator), 10 niche-specific, 5 trending/topical
- No hashtags with spaces or special characters`;
}
