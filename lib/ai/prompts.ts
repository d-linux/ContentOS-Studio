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
    format: string | null;
    length: string | null;
    scenes: Array<{ type: string; content: string }>;
  };
  targetPlatform: string;
  targetFormat?: string;
}

interface SceneRegenerationParams {
  brandBrain: BrandBrainContext;
  scriptTitle: string;
  topicDescription: string | null;
  platform: string;
  length: string | null;
  pace: string | null;
  format: string | null;
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
  format: string | null;
  length: string | null;
  scenes: Array<{ type: string; content: string }>;
  brandBrain: BrandBrainContext;
}

// ═══════════════════════════════════════════════════════════
// NICHE INTELLIGENCE
// ═══════════════════════════════════════════════════════════

const NICHE_LABELS: Record<string, string> = {
  tech_gadgets: "Tech & Gadgets",
  business_finance: "Business & Finance",
  health_fitness: "Health & Fitness",
  lifestyle_vlogs: "Lifestyle & Vlogs",
  beauty_fashion: "Beauty & Fashion",
  food_cooking: "Food & Cooking",
  education_self_improvement: "Education & Self-Improvement",
  entertainment_pop_culture: "Entertainment & Pop Culture",
  creative_art: "Creative & Art",
  travel_adventure: "Travel & Adventure",
};

const NICHE_INTEL: Record<string, string> = {
  tech_gadgets: `TECH audience: shares to look smart. Credibility = specifics ("6hr battery" not "great battery"). Comparison hooks create debate = comments. Text-on-screen: price, specs, benchmarks. Hot takes on popular tech drive 3x shares.`,
  business_finance: `FINANCE audience: skeptical by default. Lead with PROOF — numbers, receipts, personal results. "How I made £X" beats "How to make £X" by 3x. Text-on-screen: show the math. Income screenshots = most saved content.`,
  health_fitness: `FITNESS audience: transformation hooks are #1. "Stop doing X" beats "Do X" 2:1. Cite research casually. Text-on-screen: muscle groups, form cues. Myth-busting drives highest comments.`,
  lifestyle_vlogs: `LIFESTYLE audience: authenticity IS the product. "My weird 5am routine" hooks 3x better than "My morning routine." Organisation content = highest saves. Day-in-the-life needs a story arc, not just a sequence.`,
  beauty_fashion: `BEAUTY audience: GRWM = highest completion rate. Product names + PRICES must be on screen (they screenshot). "£5 dupe for £50 product" hooks drive massive engagement. Tutorials with numbered steps get 4x saves.`,
  food_cooking: `FOOD audience: SHOW FINISHED DISH IN FRAME 1. Recipe steps on screen = 5x saves. "Easy" and "under 15 min" hooks get most clicks. Note sizzle/crunch ASMR cues. Controversial food takes drive shares.`,
  education_self_improvement: `EDUCATION audience: "Things I wish I knew" frames beat straight advice 2x. Highest SAVE rate of any niche. Numbered lists with clear takeaways = 2.5x saves. Text-on-screen: the framework/steps — people screenshot these.`,
  entertainment_pop_culture: `ENTERTAINMENT audience: SPEED matters — be first with takes. Hot takes must be genuinely surprising. "Hidden details you missed" drives rewatches. Commentary must add INSIGHT, not just recap.`,
  creative_art: `ART audience: PROCESS > finished work. Timelapse with narration is dominant format. Before/after transitions = #1 hook. Tools and materials MUST be labelled. "How I made this" hooks 2x better than "Look what I made."`,
  travel_adventure: `TRAVEL audience: location reveal in FRAME 1. Budget breakdowns = highest saves ("£X for 5 days in Y"). "Hidden gems" framing outperforms tourist content 3x. Practical tips > aesthetic montages for engagement.`,
};

// ═══════════════════════════════════════════════════════════
// BRAND BRAIN → VOICE DNA
// ═══════════════════════════════════════════════════════════

export function formatBrandBrain(bb: BrandBrainContext): string {
  const parts: string[] = [];
  if (bb.name) parts.push(`Creator: ${bb.name}`);
  if (bb.tone) parts.push(`Voice: ${bb.tone}\nAMPLIFY this tone 20%. If sarcastic, be sharper. If energetic, be more electric. If chill, be more precise. Their best day, every time.`);
  if (bb.niche) {
    parts.push(`Niche: ${NICHE_LABELS[bb.niche] || bb.niche}`);
    if (NICHE_INTEL[bb.niche]) parts.push(NICHE_INTEL[bb.niche]);
  }
  if (bb.about) parts.push(`About (USE THIS — it's what makes them unique, reference their experiences naturally):\n${bb.about}`);
  if (bb.boundaries) parts.push(`BOUNDARIES (violating ANY = unusable script):\n${bb.boundaries}`);
  if (bb.youtubeData) parts.push(`YouTube data — double down on what works:\n${JSON.stringify(bb.youtubeData)}`);
  return parts.length > 0 ? parts.join("\n\n") : "No creator profile. Write naturally with genuine personality.";
}

// ═══════════════════════════════════════════════════════════
// PLATFORM INTELLIGENCE
// ═══════════════════════════════════════════════════════════

const PLATFORM: Record<string, string> = {
  youtube: `YOUTUBE: algorithm = watch time > engagement. Sweet spot 30-58s. Speak 160-180 WPM. Visual change every 2-3s. Loop endings get replays (count as views since March 2025).`,
  tiktok: `TIKTOK: algorithm = avg % watched > shares > comments. Sweet spot 20-45s. Raw > polished (60% better). Start mid-thought. 85%+ viewed sound-off — text-on-screen frame 1 mandatory. 20% higher energy than normal.`,
  instagram: `INSTAGRAM REELS: algorithm = shares > saves > comments > watch time. Sweet spot 15-30s. Over 60s deprioritised. Polished but personal. CTA for saves ("save this") or shares ("send to someone who needs this") — shares weighted MOST.`,
};

// ═══════════════════════════════════════════════════════════
// FORMAT STRUCTURES WITH EXAMPLES
// Each format has a structural pattern AND a real example
// ═══════════════════════════════════════════════════════════

const FORMAT: Record<string, string> = {
  talking_head: `TALKING HEAD — Cold Open to Payoff:
Write to ONE person, not an audience. Variable pacing: fast through support, slow for key insight. One "[BEAT]" pause. Text-on-screen: key stat or emphasis, never transcript.

EXAMPLE (30s YouTube, business niche, medium pace):
Hook: "I fired my biggest client last month. Best decision I ever made."
Context: "They were paying me four grand a month. But every single project took twice as long because of their revision process."
Value: "I replaced that revenue in two weeks. Three smaller clients, less stress, more creative control."
CTA: "If you've got a client that makes you dread Mondays — you already know what to do."`,

  listicle: `LISTICLE — Rapid Fire:
Count on screen ("1/5"). Order: second-best first, weakest middle, best last. Each item: claim → one proof → transition. Max 5 items for ≤30s, 7 for 60s.

EXAMPLE (30s TikTok, education niche, fast pace):
Hook: "Three study methods that actually work. Forget everything else."
Value 1: "Spaced repetition. Quiz yourself on day 1, day 3, day 7. Your brain literally can't forget."
Value 2: "Active recall. Close the book. Write what you remember. The struggle IS the learning."
Value 3: "Feynman technique. Explain it like you're teaching a five-year-old. If you can't simplify it, you don't know it."
CTA: "Save this. Finals week you will thank me."`,

  storytime: `STORYTIME — Tension Loop:
Start at the climax. Present tense always ("So I walk in..."). Each beat raises stakes. Include a complication. Specific details make it real. End with twist or earned lesson.

EXAMPLE (60s YouTube, lifestyle niche, medium pace):
Hook: "My landlord just showed up at my door with a police officer. I haven't done anything wrong."
Context: "So three weeks ago I put up a Ring camera because packages keep disappearing. Normal, right?"
Value: "The camera caught my neighbour. Not stealing packages — she was rearranging my welcome mat every morning at 6am. Every. Single. Morning."
Proof: "I showed the footage to my landlord. He said it's not a police matter. But then the neighbour complained that my camera violates her privacy."
Payoff: "So now I'm apparently the problem. For catching someone touching my property. On camera. At my own front door."
CTA: "Am I insane or is this the most unhinged neighbour situation you've ever heard? Comment below."`,

  tutorial: `TUTORIAL — Inverted Pyramid:
Show result first (2 seconds). Number every step on screen. One tutorial = one outcome. "[2x SPEED]" for repetitive parts. Text-on-screen: step numbers, tools, measurements.

EXAMPLE (30s Instagram, creative niche, normal pace):
Hook: "This is a £0 logo. I made it in 4 minutes. Here's how."
Value 1: "Step one. Open Canva. Pick the circle element. Make it your brand colour."
Value 2: "Step two. Add your initials in Outfit font. Bold. Centre it."
Value 3: "Step three. Export as PNG with transparent background. Done."
CTA: "Save this. Next time someone quotes you £500 for a logo, try this first."`,

  skit: `SKIT — Setup → Subversion:
Setup under 5 seconds. Visual comedy > verbal (works sound-off). Subvert the expected punchline. Add one rewatch detail. Under 30 seconds. Test: would someone send this with "😂"?

EXAMPLE (15s TikTok, entertainment niche, fast pace):
Hook: "POV: you're a productivity guru explaining your morning routine"
Value: "[speaking to camera with intense eye contact] 'I wake up at 4am. Cold shower. Journal for 30 minutes. Meditate. Review my goals. Protein shake.' [cuts to showing phone screen time: 6 hours TikTok] '...and then I get to work.'"
CTA: [no CTA — the punchline IS the ending, loop back to the intense eye contact]`,

  vlog: `VLOG — Journey Arc:
Open with most interesting moment, then rewind. Real environments. Mix direct-to-camera with overheard narration. One vulnerability moment. Time stamps + locations on screen.

EXAMPLE (60s YouTube, travel niche, normal pace):
Hook: "I just got scammed. In the most polite way possible. Let me show you."
Context: "So we're in Marrakech. Day two. And our riad host offers to 'help us navigate the medina.'"
Value: "Forty-five minutes later we've visited six shops we didn't ask for. Every shop owner 'just happens to be his friend.' And somehow I'm holding a £200 rug."
Proof: "The tour was 'free.' But I spent £300 on things I didn't want because the social pressure is UNREAL. Every tourist does this."
Payoff: "Lesson: when someone offers to help you navigate for free, the product is you."
CTA: "If you're going to Morocco, save this. Seriously."`,

  review: `REVIEW — Verdict First:
Lead with verdict ("best/worst X I've tried"). Compare to known reference. Be SPECIFIC. One genuine criticism even in positive reviews. Consistent rating system. Text-on-screen: name, price, specs.

EXAMPLE (30s YouTube, tech niche, medium pace):
Hook: "This is the best keyboard I've ever used. And I've tested forty-three."
Value: "The Keychron Q1 Pro. Seventy-five percent layout. Gasket mount. And it sounds like this — [note: typing ASMR sound cue]."
Proof: "I've been using it for three months now. Daily. The only thing I don't love is the stock keycaps — they get shiny after about six weeks."
CTA: "If you type for a living, this is the one. Link in the description. And no, this isn't sponsored — I paid for it."`,
};

// ═══════════════════════════════════════════════════════════
// LENGTH INTELLIGENCE
// ═══════════════════════════════════════════════════════════

const LENGTH: Record<string, string> = {
  "15s": `15s VIDEO: Max 3 scenes. ~30-40 words spoken. Hook in 1 second. Skip context — hook → value → cta. Text-on-screen carries 60%+. Single-punch format. LOOP ENDING is critical — seamless replay.`,
  "30s": `30s VIDEO: 3-5 scenes. ~65-85 words spoken. Hook 2s → context 5s → value+proof 15s → CTA 5s. Retention checkpoint at 15s (mini-payoff or tease). Loop ending for replay.`,
  "60s": `60s VIDEO: 5-8 scenes. ~140-170 words spoken. Full scene architecture. PIVOT at 30s mark ("But here's what nobody tells you") — viewers drop off at midpoint without re-hook. Pacing variation essential. "Big event" every 15-20 seconds.`,
};

// ═══════════════════════════════════════════════════════════
// PACE INTELLIGENCE
// ═══════════════════════════════════════════════════════════

const PACE: Record<string, string> = {
  normal: `NORMAL PACE: 130-150 WPM. Conversational. Let ideas breathe. 2-4 sentences per scene. Best for: education, reviews, vlogs, trust-building.`,
  medium: `MEDIUM PACE: 150-170 WPM. Engaged energy. Speed up through support, slow down for key insights — the CONTRAST creates emphasis. Mix sentence lengths.`,
  fast: `FAST PACE: 170-190 WPM. High energy. Cut ALL dead air. Fragments. Staccato. Every sentence earns its place or gets cut. 20% more energy than normal conversation. Best for: listicles, trends, hype content.`,
};

// ═══════════════════════════════════════════════════════════
// SERIES CONNECTION MODES
// ═══════════════════════════════════════════════════════════

const CONNECTION_MODE: Record<string, string> = {
  sequential: "SEQUENTIAL: each episode continues the story. End with cliffhanger. Episode 2+ starts with one-line callback (not recap — re-hook that works for new viewers too).",
  anthology: "ANTHOLOGY: same theme, standalone episodes. VARY angle, structure, hook pattern between episodes. Same universe, different stories.",
  running_format: "RUNNING FORMAT: same recognizable structure, fresh content. The frame stays, content changes. Viewers know what to expect within 2 seconds.",
  journey: "JOURNEY: track REAL progress. Reference past milestones naturally. Show genuine growth, setbacks included. Each episode = checkpoint.",
  response: "RESPONSE: scripts feel like replies to audience. Reference real comment patterns. Make viewers feel HEARD. Audience becomes co-creators.",
};

// ═══════════════════════════════════════════════════════════
// PROMPT BUILDERS
// All builders share: system prompt, voice DNA, examples.
// Cross-builder context: each builder receives relevant
// metadata from other builders' outputs.
// ═══════════════════════════════════════════════════════════

export function buildScriptPrompt(params: ScriptGenerationParams): string {
  return `Write a ${params.format.replace(/_/g, " ")} script about: ${params.topicDescription}

${PLATFORM[params.platform] || PLATFORM.youtube}
${FORMAT[params.format] || FORMAT.talking_head}
${LENGTH[params.length] || LENGTH["30s"]}
${PACE[params.pace] || PACE.medium}

Scene types: hook, context, value, proof, payoff, cta. Not all required — use what serves the content. Min 3, max 8.
Each scene: "content" (spoken, creator's voice, 6th grade level) + "textOnScreen" (adds info voice skips).
Title: catchy, under 60 characters.`;
}

export function buildSeriesEpisodePrompt(params: SeriesEpisodeParams): string {
  const mode = CONNECTION_MODE[params.connectionMode] || "";

  // Compress old episodes — full scenes for last 2, summaries for earlier
  const previousContext =
    params.previousEpisodes.length > 0
      ? params.previousEpisodes
          .map((ep) => {
            if (ep.episodeNumber >= params.episodeNumber - 2) {
              // Recent episodes: full scene content for voice matching
              return `Ep ${ep.episodeNumber} "${ep.title}": ${ep.scenes.map((s) => `[${s.type}] ${s.content}`).join(" | ")}`;
            }
            // Older episodes: compressed summary for context without bloat
            return `Ep ${ep.episodeNumber} "${ep.title}" (summary: ${ep.scenes[0]?.content.slice(0, 80)}...)`;
          })
          .join("\n")
      : "First episode — establish the tone and hook style that carries the series.";

  return `Write episode ${params.episodeNumber} of "${params.seriesTitle}".
Topic: ${params.topicDescription}

${mode}
${PLATFORM[params.platform] || PLATFORM.youtube}
${FORMAT[params.format] || FORMAT.talking_head}
${LENGTH[params.length] || LENGTH["30s"]}
${PACE[params.pace] || PACE.medium}

Previous episodes:
${previousContext}

CONSISTENCY: same voice, same energy, same structural patterns as previous episodes. A viewer recognises this creator instantly.

Scene types: hook, context, value, proof, payoff, cta. Min 3, max 8.
Each scene: "content" (spoken) + "textOnScreen" (visual, adds info).
Title: catchy, under 60 characters.`;
}

export function buildRemixPrompt(params: RemixParams): string {
  const scenes = params.sourceScript.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const targetFormatKey = params.targetFormat || params.sourceScript.format || "talking_head";
  const targetFormatGuide = FORMAT[targetFormatKey] || "";

  return `Remix this ${params.sourceScript.platform} script for ${params.targetPlatform}. Creative reimagining — same voice, different delivery.

Source: "${params.sourceScript.title}" (${params.sourceScript.platform}, ${params.sourceScript.format?.replace(/_/g, " ") || "talking head"})
${scenes}

Target platform:
${PLATFORM[params.targetPlatform] || PLATFORM.youtube}

Target format: ${targetFormatKey.replace(/_/g, " ")}
${targetFormatGuide}

KEEP: core insight, creator's EXACT voice, value proposition.
CHANGE: structure, pacing, hook style, length, CTA — everything platform-specific.
Voice must be IDENTICAL across platforms. Only delivery changes.
Restructure scenes to match the target format's architecture.

Each scene: "content" (spoken, same voice as source) + "textOnScreen" (visual, adds info).
Title: catchy, under 60 characters, platform-native.`;
}

export function buildSceneRegenerationPrompt(
  params: SceneRegenerationParams
): string {
  const contextScenes = params.allScenes
    .filter((s) => s.order !== params.scene.order)
    .map((s) => `[Scene ${s.order} — ${s.type}]: ${s.content}`)
    .join("\n");

  const constraints = [
    params.length && `Length: ${params.length}`,
    params.pace && `Pace: ${params.pace}`,
    params.format && `Format: ${params.format.replace(/_/g, " ")}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return `Rewrite scene ${params.scene.order} (${params.scene.type}) of "${params.scriptTitle}" (${params.platform}${constraints ? `, ${constraints}` : ""}).
${params.topicDescription ? `\nScript topic: ${params.topicDescription}\nSTAY ON TOPIC — the regenerated scene must serve this topic directly.\n` : ""}
Current version (throw away — start fresh):
"${params.scene.content}"

Surrounding scenes (match their tone, energy, voice EXACTLY):
${contextScenes}

Write a MEANINGFULLY DIFFERENT take — new angle, new example, new framing. Not synonyms.
Must feel like same creator, same session, same energy level as surrounding scenes.
"content" (spoken) + "textOnScreen" (visual, adds info — never transcript).`;
}

export function buildCaptionPrompt(params: CaptionParams): string {
  const sceneSummary = params.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const hookScene = params.scenes.find((s) => s.type === "hook");
  const ctaScene = params.scenes.find((s) => s.type === "cta");

  const platformCaption: Record<string, string> = {
    tiktok: "TikTok: 1-2 lines max. Keywords for search. 3-5 hashtags (broad + niche).",
    youtube: "YouTube Shorts: searchable title energy. Keywords matter. #Shorts + 2-3 niche tags.",
    instagram: "Instagram: 2-5 sentence micro-blog OK (reading time counts in algorithm). Saves + shares weighted most. 5-10 hashtags.",
  };

  return `Caption + hashtags for "${params.scriptTitle}" (${params.platform}, ${params.format?.replace(/_/g, " ") || "video"}, ${params.length || "30s"}).

Script content:
${sceneSummary}

Hook used: "${hookScene?.content || "N/A"}"
CTA used: "${ctaScene?.content || "N/A"}"

${platformCaption[params.platform] || platformCaption.youtube}

MATCH the script's voice and energy exactly. Caption should feel like the creator typed it right after filming.
First line = hook (appears in feed preview). One CTA: save, share, or comment prompt — pick what matches the content.
Under 150 words. Hashtags: space-separated string, 5-15 tags, broad + niche mix.`;
}
