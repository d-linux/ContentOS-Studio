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

function formatBrandBrain(bb: BrandBrainContext): string {
  const parts: string[] = [];
  if (bb.name) parts.push(`Creator name: ${bb.name}`);
  if (bb.tone) parts.push(`Tone/voice: ${bb.tone}`);
  if (bb.niche) parts.push(`Niche: ${bb.niche}`);
  if (bb.about) parts.push(`About: ${bb.about}`);
  if (bb.boundaries)
    parts.push(`Boundaries (never mention/do): ${bb.boundaries}`);
  if (bb.youtubeData)
    parts.push(
      `YouTube performance insights: ${JSON.stringify(bb.youtubeData)}`
    );
  return parts.length > 0 ? parts.join("\n") : "No brand context provided yet.";
}

const CONNECTION_MODE_INSTRUCTIONS: Record<string, string> = {
  sequential:
    "This is a sequential series. Each episode continues the story linearly. Include cliffhangers at the end and 'last time' style recaps at the start (after episode 1).",
  anthology:
    "This is an anthology series. Each episode is standalone but shares the same theme. No direct story continuation needed.",
  running_format:
    "This is a running format series. Each episode follows the same structure/premise but with fresh content each time. Maintain the recognizable format.",
  journey:
    "This is a journey series. Track progress across episodes and reference past milestones. Show growth and evolution.",
  response:
    "This is a response series. Each episode should feel like a reply to audience engagement. Reference common questions, comments, or reactions.",
};

export function buildScriptPrompt(params: ScriptGenerationParams): string {
  return `You are an expert short-form video scriptwriter. Generate a script based on the creator's brand and the request below.

## Creator Brand Context
${formatBrandBrain(params.brandBrain)}

## Request
- Topic: ${params.topicDescription}
- Platform: ${params.platform}
- Length: ${params.length}
- Pace: ${params.pace}
- Format: ${params.format}

## Instructions
- Write in the creator's authentic voice and tone
- Structure the script as a series of scenes: hook, context, value, proof, payoff, CTA
- Each scene should have spoken content AND text-on-screen suggestions
- The hook must grab attention in the first 2 seconds
- Adapt the style and language to ${params.platform}'s culture and audience expectations
- Respect all boundaries listed in the brand context
- Make the script feel natural and conversational, not scripted or robotic`;
}

export function buildSeriesEpisodePrompt(params: SeriesEpisodeParams): string {
  const previousContext =
    params.previousEpisodes.length > 0
      ? params.previousEpisodes
          .map(
            (ep) =>
              `Episode ${ep.episodeNumber} — "${ep.title}": ${ep.scenes.map((s) => s.content).join(" ")}`
          )
          .join("\n\n")
      : "This is the first episode.";

  return `You are an expert short-form video scriptwriter creating episode ${params.episodeNumber} of the series "${params.seriesTitle}".

## Creator Brand Context
${formatBrandBrain(params.brandBrain)}

## Series Info
- Series: "${params.seriesTitle}"
- Connection mode: ${params.connectionMode}
- ${CONNECTION_MODE_INSTRUCTIONS[params.connectionMode] || ""}

## Previous Episodes
${previousContext}

## This Episode's Request
- Topic: ${params.topicDescription}
- Platform: ${params.platform}
- Length: ${params.length}
- Pace: ${params.pace}
- Format: ${params.format}

## Instructions
- Write in the creator's authentic voice
- Follow the connection mode rules strictly
- Reference previous episodes where the connection mode requires it
- Structure as scenes: hook, context, value, proof, payoff, CTA
- Each scene needs spoken content AND text-on-screen
- Respect all brand boundaries`;
}

export function buildRemixPrompt(params: RemixParams): string {
  const originalScenes = params.sourceScript.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  return `You are an expert short-form video scriptwriter. Remix the following script for a completely different platform.

## Creator Brand Context
${formatBrandBrain(params.brandBrain)}

## Original Script
- Title: "${params.sourceScript.title}"
- Original platform: ${params.sourceScript.platform}
- Scenes:
${originalScenes}

## Target Platform: ${params.targetPlatform}

## Instructions
- Create a COMPLETELY NEW script optimized for ${params.targetPlatform}'s culture, audience, and content style
- Keep the core message/value but adapt delivery, pacing, language, and structure
- This is NOT a copy-paste — it's a creative reimagining for a different audience
- Write in the creator's authentic voice
- Structure as scenes: hook, context, value, proof, payoff, CTA
- Each scene needs spoken content AND text-on-screen
- Respect all brand boundaries`;
}

export function buildSceneRegenerationPrompt(
  params: SceneRegenerationParams
): string {
  const contextScenes = params.allScenes
    .filter((s) => s.order !== params.scene.order)
    .map((s) => `[Scene ${s.order} - ${s.type}]: ${s.content}`)
    .join("\n");

  return `You are an expert short-form video scriptwriter. Regenerate a single scene while keeping it consistent with the rest of the script.

## Creator Brand Context
${formatBrandBrain(params.brandBrain)}

## Script: "${params.scriptTitle}" (${params.platform})

## Other Scenes (for context)
${contextScenes}

## Scene to Regenerate
- Scene ${params.scene.order} (${params.scene.type})
- Original: "${params.scene.content}"

## Instructions
- Write a fresh, different take on this ${params.scene.type} scene
- Keep it consistent with the surrounding scenes
- Match the creator's voice and tone
- Provide both spoken content and text-on-screen
- Make it meaningfully different from the original — not just a minor rewording`;
}

export function buildCaptionPrompt(params: CaptionParams): string {
  const sceneSummary = params.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  return `Generate a social media caption and hashtags for this ${params.platform} video.

## Creator Brand Context
${formatBrandBrain(params.brandBrain)}

## Script: "${params.scriptTitle}"
${sceneSummary}

## Instructions
- Write a compelling caption that drives engagement (comments, shares, saves)
- Match the tone and platform culture of ${params.platform}
- Include a call-to-action in the caption
- Generate 15-20 relevant hashtags (mix of broad and niche)
- Format hashtags as a space-separated string`;
}
