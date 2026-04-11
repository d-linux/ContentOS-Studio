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
    parts.push(`Hard boundaries (NEVER violate these): ${bb.boundaries}`);
  if (bb.youtubeData)
    parts.push(
      `Past YouTube performance data — use this to inform what hooks, topics, and pacing work for this creator:\n${JSON.stringify(bb.youtubeData)}`
    );
  return parts.length > 0
    ? `## Creator Profile\n${parts.join("\n")}`
    : "No creator profile yet — write in a natural, conversational voice.";
}

// ─── Platform-specific rules ───

const PLATFORM_RULES: Record<string, string> = {
  youtube: `YOUTUBE rules:
- Sweet spot: 30-58 seconds for Shorts, structure permits longer for full videos
- Algorithm weights watch time + engagement rate — completion rate is king
- First 0.5s is visual (text on screen), verbal hook lands by second 1.5
- Slightly higher production value than TikTok — viewers expect structure
- End with a CTA that ties back to the video's value, not generic "like and subscribe"
- Speak at 160-180 WPM — faster than conversation, slower than auctioneer
- Visual change every 2-3 seconds to maintain retention`,

  tiktok: `TIKTOK rules:
- Sweet spot: 30-60 seconds. Under 15s needs near-perfect loop mechanics
- Algorithm weights average percentage watched — a 30s video at 90% beats a 60s at 50%
- Raw, unfiltered energy — polished content underperforms native-feeling content
- Start mid-thought. First word must hook. Not "so" or "okay"
- 85%+ viewed with sound off initially — text on screen in first frame is mandatory
- Short punchy sentences. Fragments. One idea per breath.
- No formal CTAs — end on a cliffhanger, hot take, or "try this and tell me"
- Sound-off viewability: text on screen must tell the story independently`,

  instagram: `INSTAGRAM REELS rules:
- Sweet spot: 15-30 seconds. Over 60s gets deprioritized in Explore/Reels tab
- Algorithm weights shares + saves MORE than watch time — optimize for "send this to someone"
- Polished but personal — like a well-edited voice note
- Visual-first: text on screen does heavy lifting
- Hook with a bold claim or relatable frustration — "nobody talks about this" energy
- Concise — say it in 3 words if you can, not 10
- CTA should feel like sharing insider knowledge: "save this for later"
- Caption can be micro-blog length (2-5 sentences) — Instagram factors in reading time`,
};

// ─── Format-specific structure templates ───

const FORMAT_TEMPLATES: Record<string, string> = {
  talking_head: `TALKING HEAD format:
Structure: Cold Open to Payoff
- Face fills 40-60% of frame. Direct eye contact energy in the writing.
- Write as if speaking directly to one person, not an audience
- Use hand gesture cues in text-on-screen: "[POINT]", "[HOLDS UP PHONE]" etc.
- Variable pacing: speed through supporting details, slow down for the key insight
- Add natural asides: "(which, by the way, nobody talks about)" — these feel authentic
- One deliberate pause/beat per script — silence is a tool`,

  listicle: `LISTICLE format:
Structure: Rapid Fire
- Show the count on screen: "1/5", "2/5" etc. This is a progress bar that keeps viewers watching
- Order: second-best item first (hooks), weakest in the middle (buried), best item last (payoff)
- Each item gets a visual transition — never just "and next..."
- Max 5 items for under 60s, max 7 for longer
- Each item: claim → one specific proof point → transition
- Text on screen: the item name/number as a label, a stat or detail the voice skips`,

  storytime: `STORYTIME format:
Structure: Tension Loop
- START AT THE CLIMAX or just before: "I got fired on my first day. Here's what happened."
- Use present tense: "So I walk in and..." not "So I walked in and..." — present tense creates immediacy
- Each beat MUST raise stakes — if tension plateaus, viewers leave
- Include at least one "and then it got worse" / complication moment
- End with a twist or earned lesson — the payoff must justify the investment
- Use specific details: "the Chipotle on 5th and Main" not "a restaurant"
- Text on screen: location labels, time stamps ("2 hours later"), reaction cues`,

  tutorial: `TUTORIAL format:
Structure: Inverted Pyramid
- SHOW THE RESULT FIRST: before-and-after in the first 2 seconds
- Then "Here's exactly how" — number every step on screen
- One tutorial = one outcome. Never combine multiple tutorials.
- Speed up tedious parts: note "[SPEED UP 2x]" for repetitive actions
- Each step: what to do → why it matters (one sentence) → what it should look like
- Text on screen: step numbers, tool/ingredient names, measurements — the reference material
- Tutorials get the highest save rate — optimize for "I'll need this later"`,

  skit: `SKIT format:
Structure: Setup → Subversion
- Setup MUST be under 5 seconds — comedy has the lowest patience threshold
- Write for visual comedy that works sound-off, not just verbal punchlines
- Subvert the expected punchline — the audience is pattern-matching, break their prediction
- Add a detail that only catches on rewatch — this drives replay value
- Keep under 30 seconds — comedy has diminishing returns past this
- Text on screen: character labels, location, internal thoughts — the second layer of comedy
- The last frame should make someone want to send it to a friend`,

  vlog: `VLOG format:
Structure: Day-in-the-Life / Journey
- Open with the most interesting moment, then "let me rewind"
- Show real environments, real situations — vlog energy is "I'm bringing you along"
- Time stamps and location labels on screen build narrative structure
- Mix direct-to-camera with "overheard" style narration
- Include one genuine unscripted-feeling reaction or moment of vulnerability
- End with a reflection that ties the day/experience to a bigger theme
- Text on screen: time stamps, location names, inner monologue captions`,

  review: `REVIEW format:
Structure: Verdict First → Evidence
- Lead with the verdict: "This is the best/worst X I've tried. Here's why."
- Never save the conclusion for the end — that's a blog post, not a video
- Compare to something the audience already knows: "It's like X but better at Y"
- Be specific: "battery lasted 6 hours of continuous use" not "great battery life"
- Include one genuine criticism even in positive reviews — credibility depends on it
- Use a personal rating system that's consistent across reviews
- Text on screen: product name, price, specs, rating — the stuff viewers screenshot`,
};

// ─── Pace instructions ───

const PACE_INSTRUCTIONS: Record<string, string> = {
  slow: `SLOW PACE:
- 120-140 words per minute. Deliberate, measured delivery.
- Longer pauses between ideas — let each point breathe
- Fewer scenes (3-4 for short content). More depth per scene.
- Works best for: emotional content, trust-building, luxury/aspiration
- Each scene can be 3-5 sentences. Take time with details.`,

  medium: `MEDIUM PACE:
- 150-170 words per minute. Conversational energy.
- Natural rhythm — speed up through supporting details, slow down for key insights
- Standard scene count (4-6). Balance depth with momentum.
- Mix sentence lengths: a long setup → short punchy payoff`,

  fast: `FAST PACE:
- 170-190 words per minute. High energy, rapid delivery.
- Minimal pauses — cut dead air, jump between ideas
- More scenes (5-8) with less depth each. Rapid fire information.
- Short sentences. Fragments. Staccato rhythm.
- Every sentence must earn its place — if it doesn't add value, cut it.
- Works best for: listicles, tutorials, "things you didn't know" content`,
};

// ─── Viral hook patterns ───

const HOOK_PATTERNS = `HOOK PATTERNS (use one — rotate across scripts, never the same twice for one creator):
1. Contrarian claim: "Nobody talks about why [common thing] is actually wrong"
2. Mid-action cold open: start at the climax, then "let me explain"
3. Direct address + specific number: "3 things I wish I knew before..."
4. Pattern interrupt: unexpected visual/sound cue in first frame
5. Negative framing: "Stop doing this with your [topic]"
6. Insider knowledge: "This trick that [authority] uses but won't tell you"
7. Challenge assumption: "Why do you think X works? It doesn't."

HOOK RULES:
- Must land in under 2 seconds of speech (under 8 words for questions)
- First 0.5 seconds is visual — text on screen must appear in frame 1
- NEVER start with: greeting, intro, logo, "so", "okay", context, or backstory
- Open loop: promise something that isn't delivered until the payoff scene`;

// ─── Connection mode instructions for series ───

const CONNECTION_MODE_INSTRUCTIONS: Record<string, string> = {
  sequential:
    "SEQUENTIAL series: each episode continues the story. End with a cliffhanger or open question. Start episode 2+ with a quick callback (not a full recap — one line that re-hooks). The hook must work for both new and returning viewers.",
  anthology:
    "ANTHOLOGY series: same theme, standalone episodes. Each works alone but feels part of a collection. Vary the angle, structure, and hook pattern — repetitive anthology = dead series.",
  running_format:
    "RUNNING FORMAT series: same recognizable structure every time, fresh content. Think of it like a show segment — the frame stays, the content changes. Lean into the ritual. Viewers should know what to expect structurally.",
  journey:
    "JOURNEY series: track real progress. Reference specific past milestones naturally — 'remember when I said X? Here's what happened.' Show genuine growth, not manufactured arcs. Each episode should feel like a checkpoint.",
  response:
    "RESPONSE series: scripts that feel like replies to the audience. Reference real patterns in comments/DMs — 'a lot of you asked about X' or 'someone said Y and honestly...' Make viewers feel heard. This builds community.",
};

// ─── Humanizer rules (added to system prompt) ───

const HUMANIZER_RULES = `HUMANIZER — these make the script sound like a real person, not AI:
1. Use contractions always: "don't", "won't", "that's", "here's" — NEVER the expanded form
2. Include 1-2 sentence fragments per script: "Best part? Free." not "The best part is that it is free."
3. Add ONE self-correction or aside: "Actually wait—" or "(which, by the way, nobody mentions)"
4. Use specific details over generic: "my Notion template" not "a productivity tool"
5. Vary sentence lengths dramatically: a 20-word sentence followed by a 3-word sentence
6. Include ONE moment of genuine opinion: "Honestly? I think this is overrated" — take a stance
7. Use present tense for stories: "So I walk in and..." not "So I walked in and..."
8. Add verbal texture: "look", "here's the thing", "real talk" — but only once each, max
9. No uniform scene lengths — some scenes are 1 sentence, some are 4
10. Read it out loud mentally — if you'd stumble saying it, rewrite it`;

// ─── Prompt builders ───

export function buildScriptPrompt(params: ScriptGenerationParams): string {
  const platformRules =
    PLATFORM_RULES[params.platform] || PLATFORM_RULES.youtube;
  const formatTemplate =
    FORMAT_TEMPLATES[params.format] || FORMAT_TEMPLATES.talking_head;
  const paceGuide = PACE_INSTRUCTIONS[params.pace] || PACE_INSTRUCTIONS.medium;

  return `Write a script about: ${params.topicDescription}

Target: ${params.platform} | ${params.length} | ${params.pace} pace | ${params.format}

${platformRules}

${formatTemplate}

${paceGuide}

${HOOK_PATTERNS}

${HUMANIZER_RULES}

SCENE STRUCTURE:
- Use scene types: hook, context, value, proof, payoff, cta
- You DON'T need all 6 — merge or skip types if the content flows better. A 15-second TikTok might only need hook + value + cta.
- Minimum 3 scenes, maximum 8
- Each scene returns: "content" (what the creator SAYS — spoken language) and "textOnScreen" (visual text that ADDS info the voice doesn't say — stats, labels, emphasis, NEVER a transcript)
- The title should be catchy and under 60 characters — it appears in the library`;
}

export function buildSeriesEpisodePrompt(params: SeriesEpisodeParams): string {
  const platformRules =
    PLATFORM_RULES[params.platform] || PLATFORM_RULES.youtube;
  const formatTemplate =
    FORMAT_TEMPLATES[params.format] || FORMAT_TEMPLATES.talking_head;
  const paceGuide = PACE_INSTRUCTIONS[params.pace] || PACE_INSTRUCTIONS.medium;
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
      : "First episode — establish the tone, hook style, and structure that will carry the series.";

  return `Write episode ${params.episodeNumber} of "${params.seriesTitle}".

Topic for this episode: ${params.topicDescription}

${modeInstruction}

${platformRules}

${formatTemplate}

${paceGuide}

${HOOK_PATTERNS}

${HUMANIZER_RULES}

## Previous episodes (for continuity — reference only where it serves the story)
${previousContext}

SCENE STRUCTURE: hook, context, value, proof, payoff, cta (not all required). Min 3, max 8 scenes.
Each scene: "content" (spoken) + "textOnScreen" (visual, adds info voice doesn't say).
Title: catchy, under 60 characters.`;
}

export function buildRemixPrompt(params: RemixParams): string {
  const originalScenes = params.sourceScript.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const targetRules =
    PLATFORM_RULES[params.targetPlatform] || PLATFORM_RULES.youtube;

  return `Remix this script for ${params.targetPlatform}. This is a CREATIVE REIMAGINING — not a reformat.

## Source (${params.sourceScript.platform})
"${params.sourceScript.title}"
${originalScenes}

## Target: ${params.targetPlatform}
${targetRules}

${HOOK_PATTERNS}

${HUMANIZER_RULES}

WHAT TO KEEP: the core insight, the creator's personality, the value proposition.
WHAT TO CHANGE: structure, pacing, hook style, language, CTA — everything that makes a ${params.sourceScript.platform} script feel wrong on ${params.targetPlatform}.

A good remix makes someone think "this was made for ${params.targetPlatform}" — not "this was adapted from somewhere else."

Adjust scene count to match ${params.targetPlatform}'s optimal length. Fewer scenes for shorter platforms.
Each scene: "content" (spoken) + "textOnScreen" (visual, adds info voice doesn't say).
Title: catchy, under 60 characters.`;
}

export function buildSceneRegenerationPrompt(
  params: SceneRegenerationParams
): string {
  const contextScenes = params.allScenes
    .filter((s) => s.order !== params.scene.order)
    .map((s) => `[Scene ${s.order} — ${s.type}]: ${s.content}`)
    .join("\n");

  return `Rewrite scene ${params.scene.order} (${params.scene.type}) of "${params.scriptTitle}" (${params.platform}).

## Current version (replace entirely — don't iterate on it, start fresh)
"${params.scene.content}"

## Surrounding scenes (match tone and flow)
${contextScenes}

${HUMANIZER_RULES}

Write a meaningfully different take. Change the angle, example, or framing — not just synonyms. Keep the scene type (${params.scene.type}) and make it fit naturally between surrounding scenes.

Return "content" (spoken) and "textOnScreen" (visual, adds info — not a transcript).`;
}

export function buildCaptionPrompt(params: CaptionParams): string {
  const sceneSummary = params.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const platformCaptionRules: Record<string, string> = {
    tiktok:
      "TikTok caption: 1-2 lines max. Include keywords for TikTok search. Hashtags still matter for categorization.",
    youtube:
      "YouTube Shorts: title matters more than description. Keep title energy. Keywords help because Shorts appear in YouTube search.",
    instagram:
      "Instagram: longer captions work (2-5 sentences, micro-blog style). Instagram factors in time spent reading captions. Lead with the hook line.",
  };

  return `Write a ${params.platform} caption and hashtags for "${params.scriptTitle}".

## Script content
${sceneSummary}

${platformCaptionRules[params.platform] || platformCaptionRules.youtube}

CAPTION RULES:
- First line IS the hook — this appears in feed preview. Treat it as a second headline
- Write like the creator talks, not like a marketer
- Include one CTA: "save this for later" drives saves, "send this to someone who..." drives shares
- Under 150 words total

HASHTAGS:
- 15-20 hashtags, space-separated in a single string
- Mix: 5 broad reach (1M+ posts), 10 niche-specific, 5 trending/topical
- No hashtags with spaces or special characters
- The era of 30-hashtag spam is over — quality over quantity`;
}
