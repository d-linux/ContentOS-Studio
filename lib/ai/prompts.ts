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

// ═══════════════════════════════════════════════════════════
// NICHE INTELLIGENCE
// Deep knowledge per niche — audience psychology, proof types,
// content patterns, what makes THIS audience share
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

const NICHE_INTELLIGENCE: Record<string, string> = {
  tech_gadgets: `TECH & GADGETS audience psychology:
- They share to look smart. Give them insider knowledge they can pass on.
- Credibility = specifics. "Battery lasts 6 hours of screen-on time" beats "great battery life"
- Comparison hooks outperform feature lists: "X vs Y" creates debate = comments = algorithm boost
- This audience SCREENSHOTS specs. Text-on-screen should show: price, specs, benchmark scores
- Unboxing hooks must be fast — skip packaging, get to the reveal in under 3 seconds
- Hot takes on popular tech ("the iPhone is overrated for THIS reason") drive 3x more shares
- Sub-niches: smartphones, laptops, smart home, apps, AI tools, gaming hardware, productivity software`,

  business_finance: `BUSINESS & FINANCE audience psychology:
- This audience is skeptical by default. Lead with PROOF — personal results, specific numbers, receipts
- "How I made £X" outperforms "How to make £X" — personal proof beats generic advice by 3x
- Income screenshots and result breakdowns are the #1 saved content type in this niche
- Break complex concepts with everyday analogies — jargon kills completion rates
- Text-on-screen: show the math, the numbers, the revenue charts — financial content lives on proof
- Hot takes on popular finance advice drive comments ("Stop saving money. Here's why.")
- Sub-niches: side hustles, investing, crypto, personal finance, entrepreneurship, real estate`,

  health_fitness: `HEALTH & FITNESS audience psychology:
- Transformation content (before/after) is the #1 hook — viewers share aspirational results
- "Stop doing X exercise" outperforms "Do this exercise" by 2:1 — negative framing triggers self-check
- Cite research casually: "a 2024 study found..." — this audience values evidence but not lectures
- Form demonstrations need text-on-screen labelling muscle groups and common mistakes
- "What I eat in a day" needs a unique angle NOW — the format is saturated without personality
- Myth-busting drives the highest comment rates in fitness ("You don't need 8 glasses of water")
- Sub-niches: gym, nutrition, yoga, mental health, running, weight loss, sports, supplements`,

  lifestyle_vlogs: `LIFESTYLE & VLOGS audience psychology:
- Authenticity IS the product. Polished ≠ relatable here. Raw moments > perfect moments
- "My weird 5am routine" hooks 3x better than "My morning routine" — personality in the title
- Organisation and minimalism content gets the highest SAVE rates — people bookmark for later
- Aesthetic matters more here than tech/business — colour grading, music sync, visual rhythm
- "Day in the life" needs a STORY ARC — just a sequence of activities is boring, there must be tension
- Relationship and roommate content drives comments but polarises — know the line
- Sub-niches: routines, minimalism, apartment tours, productivity, relationships, moving, organisation`,

  beauty_fashion: `BEAUTY & FASHION audience psychology:
- "Get ready with me" (GRWM) has the highest completion rate of ANY format in beauty
- Product names and PRICES must be on screen — this audience screenshots for shopping lists
- "£5 dupe for the £50 product" hooks drive massive engagement — everyone loves a deal
- Tutorial steps MUST be numbered and visible — viewers save these at 4x the rate of other content
- Honest negative reviews build MORE trust than all-positive: "I wanted to love this but..."
- Trend commentary ("is this trend actually worth it?") outperforms just following the trend
- Sub-niches: makeup tutorials, skincare, hauls, styling, grooming, nail art, fashion commentary`,

  food_cooking: `FOOD & COOKING audience psychology:
- SHOW THE FINISHED DISH IN FRAME 1. Food content is visual-first — the result IS the hook
- Recipe steps on screen (amounts, temperatures, times) drive saves at 5x the average
- ASMR cooking sounds boost retention — script should note sizzle/crunch cues for text-on-screen
- "Easy" and "under 15 minutes" in hooks drive the most clicks in all of food content
- Ingredient close-ups and plating shots noted in text-on-screen create professional feel
- Controversial food opinions drive shares: "Pineapple on pizza is actually genius. Fight me."
- Sub-niches: recipes, meal prep, restaurant reviews, food science, baking, mukbang, budget meals`,

  education_self_improvement: `EDUCATION & SELF-IMPROVEMENT audience psychology:
- "Things I wish I knew" and "mistakes I made" frames outperform straight advice by 2x
- This audience SAVES more than any other niche — give them actionable frameworks they'll return to
- Numbered lists with clear takeaways get 2.5x more saves than unstructured content
- Use analogies and visual metaphors — abstract concepts need concrete anchors to stick
- Text-on-screen should be THE framework/model/steps — people screenshot these
- Credibility comes from showing the journey, not claiming expertise: "I failed 3 times before..."
- Sub-niches: study tips, languages, book summaries, productivity, career advice, habits, psychology`,

  entertainment_pop_culture: `ENTERTAINMENT & POP CULTURE audience psychology:
- SPEED matters. Be first with takes on new releases, celebrity news, viral moments
- Hot takes must be genuinely surprising — lukewarm opinions get zero engagement in this niche
- Reaction content needs AUTHENTIC emotion — performative reactions read as fake instantly
- "Hidden details you missed" drives rewatches — people come back to verify your claims
- Meme literacy is mandatory — reference current formats or you lose credibility
- Commentary should add INSIGHT the audience hasn't considered, not just recap events
- Sub-niches: movies, TV shows, music, celebrity culture, internet culture, memes, gaming news`,

  creative_art: `CREATIVE & ART audience psychology:
- PROCESS content outperforms finished work — show the creation, not just the result
- Speed-up timelapse with narration is the dominant format — the transformation IS the hook
- Before/after transitions are the #1 hook in all creative content
- Tools and materials MUST be labelled on screen — this audience wants to try it themselves
- "How I made this" hooks 2x better than "Look what I made" — process > product
- Music choice matters more here than any other niche — audio aesthetic is part of the brand
- Sub-niches: digital art, photography, music production, design, DIY, crafts, writing, filmmaking`,

  travel_adventure: `TRAVEL & ADVENTURE audience psychology:
- Location reveal in FRAME 1 — travel is the most visual-first niche
- Budget breakdowns drive the highest saves: "I spent £X for 5 days in Y — here's the breakdown"
- "Hidden gems" and "locals only" framing outperforms mainstream tourist content 3x
- Practical tips (visa, transport, scams to avoid) get MORE engagement than aesthetic montages
- Expectations vs reality comparisons build trust — authenticity wins in travel
- Drone shots and wide establishing shots should be noted as text-on-screen cues
- Sub-niches: budget travel, luxury, van life, hiking, cultural experiences, food travel, solo travel`,
};

// ═══════════════════════════════════════════════════════════
// BRAND BRAIN → VOICE DNA (cached as system context)
// This is the creator's identity — amplified, not replaced
// ═══════════════════════════════════════════════════════════

export function formatBrandBrain(bb: BrandBrainContext): string {
  const parts: string[] = [];

  if (bb.name) parts.push(`Creator: ${bb.name}`);

  if (bb.tone) {
    parts.push(`Voice DNA: ${bb.tone}`);
    parts.push(
      `AMPLIFICATION RULE: Take this tone and push it 20% further. If they're sarcastic, be sharper. If they're energetic, be more electric. If they're calm, be more precise. You are their voice on their BEST day.`
    );
  }

  if (bb.niche) {
    const nicheLabel = NICHE_LABELS[bb.niche] || bb.niche;
    const nicheIntel = NICHE_INTELLIGENCE[bb.niche] || "";
    parts.push(`Niche: ${nicheLabel}`);
    if (nicheIntel) parts.push(nicheIntel);
  }

  if (bb.about) {
    parts.push(`About this creator (USE THIS — it's what makes them unique):\n${bb.about}`);
  }

  if (bb.boundaries) {
    parts.push(`HARD BOUNDARIES — violating ANY of these makes the script unusable:\n${bb.boundaries}`);
  }

  if (bb.youtubeData) {
    parts.push(
      `YouTube performance data — use this to double down on what works and avoid what doesn't:\n${JSON.stringify(bb.youtubeData)}`
    );
  }

  return parts.length > 0
    ? `## CREATOR VOICE DNA\n${parts.join("\n\n")}`
    : "No creator profile yet — write in a natural, conversational voice with genuine personality.";
}

// ═══════════════════════════════════════════════════════════
// PLATFORM INTELLIGENCE
// Algorithm rules, audience behavior, optimal patterns
// ═══════════════════════════════════════════════════════════

const PLATFORM_INTELLIGENCE: Record<string, string> = {
  youtube: `YOUTUBE SHORTS intelligence:
- Algorithm weights: watch time > engagement rate > click-through
- Sweet spot: 30-58 seconds. Under 20s has low impression ceiling unless replay rate is extreme
- 65% of viewers who watch 3 seconds continue for 10+ seconds — the 3-second rule is real
- Slightly higher production value than TikTok — YouTube viewers expect structure
- Searchable titles matter — YouTube Shorts appear in search results
- Speak at 160-180 WPM — faster than conversation, slower than auctioneer
- Visual change every 2-3 seconds to maintain retention
- End CTA should tie back to the video's value, not generic "like and subscribe"
- Loop mechanic: ending that connects to opening gets replays, and since March 2025 replays count as additional views`,

  tiktok: `TIKTOK intelligence:
- Algorithm weights: average % watched > shares > comments > likes
- Sweet spot: 20-45 seconds. A 30s video at 90% completion CRUSHES a 60s at 50%
- Raw > polished. Content that looks "native" outperforms produced content by 60%
- Start MID-THOUGHT. First word must hook. Not "so" or "okay" — enter the conversation already happening
- 85%+ viewed with sound off initially — text-on-screen in first frame is MANDATORY
- 20% higher energy than normal conversation. Edit out ALL dead air.
- Trending sounds boost distribution — note sound cue suggestions in text-on-screen
- No formal CTAs — end on cliffhanger, hot take, or "try this and tell me what happens"
- Loop mechanic: seamless ending that makes replay feel like continuation, not restart`,

  instagram: `INSTAGRAM REELS intelligence:
- Algorithm weights: shares > saves > comments > watch time (Instagram uniquely prioritises sharing)
- Sweet spot: 15-30 seconds. Over 60s gets deprioritised in Explore and Reels tab
- Polished but personal — like a well-edited voice note to someone you respect
- Visual-first: text-on-screen does 50%+ of the storytelling
- Hook with bold claim or relatable frustration — "nobody talks about this" energy
- Concise — say it in 3 words if you can, not 10
- Caption can be micro-blog length (2-5 sentences) — Instagram factors in time reading captions
- CTA for saves: "save this for later" — saves are weighted heavily
- CTA for shares: "send this to someone who needs it" — shares are weighted MOST heavily`,
};

// ═══════════════════════════════════════════════════════════
// FORMAT STRUCTURE TEMPLATES
// Scene-level architecture per format type
// ═══════════════════════════════════════════════════════════

const FORMAT_STRUCTURES: Record<string, string> = {
  talking_head: `TALKING HEAD — Cold Open to Payoff:
- Direct-to-camera energy. Write as if speaking to ONE person, not an audience.
- Variable pacing: speed through supporting details, slow down dramatically for the key insight
- Add natural verbal texture: "look", "real talk", "here's what nobody says" — max once each
- ONE deliberate pause/beat per script — silence is a tool, note it as "[BEAT]" in the script
- Text-on-screen: key stat, pull quote, or emphasis word — never transcript
- The payoff scene should feel like a mic drop — the single insight that makes everything click`,

  listicle: `LISTICLE — Rapid Fire:
- Show count on screen: "1/5", "2/5" — this is a progress bar that keeps viewers watching
- ORDER MATTERS: second-best item first (hook), weakest in middle (buried), best item last (payoff that drives share)
- Each item: claim → ONE specific proof point → transition. No filler.
- Transitions between items: visual wipe cue in text-on-screen, never just "and next..."
- Max 5 items for 30s or under, max 7 for 60s
- Text-on-screen: item name/number as label + a detail the voice skips`,

  storytime: `STORYTIME — Tension Loop:
- START AT THE CLIMAX: "I got fired on my first day. Here's what happened."
- PRESENT TENSE always: "So I walk in and..." not "So I walked in and..." — immediacy
- Each beat MUST raise stakes — if tension plateaus for even one scene, viewers leave
- Include a "complication" — "And then it got worse" or "But that's not even the worst part"
- Specific details make it real: "the Tesco on Park Road" not "a shop", "my boss Karen" not "my boss"
- End with twist or earned lesson — the payoff MUST justify the time investment
- Text-on-screen: location labels, time stamps ("2 hours later"), reaction cues ("😐"), internal thoughts`,

  tutorial: `TUTORIAL — Inverted Pyramid:
- SHOW THE RESULT FIRST: before-and-after in the first 2 seconds. "Here's what we're making"
- Number every step on screen — visual progress indicator
- One tutorial = one outcome. NEVER combine tutorials.
- Speed up tedious parts: note "[2x SPEED]" for repetitive actions
- Each step: what to do → why it matters (one sentence max) → what it should look like
- Text-on-screen: step numbers, tool names, measurements, settings — the reference material
- Tutorials get the HIGHEST save rate of all formats — optimise for "I'll need this later" saves`,

  skit: `SKIT — Setup → Subversion:
- Setup MUST be under 5 seconds — comedy has the lowest patience threshold of any format
- Write for VISUAL comedy that works sound-off — physical gag or text reveal, not just verbal
- SUBVERT the expected punchline. The audience is pattern-matching — break their prediction
- Add one detail that only catches on REWATCH — this drives replay value and sharing ("did you see...")
- Keep under 30 seconds — comedy has diminishing returns past this
- Text-on-screen: character labels, location, internal thoughts — the second layer of comedy
- Test: would someone send this to a friend with "😂😂😂"? If not, the punchline isn't sharp enough`,

  vlog: `VLOG — Journey Arc:
- Open with the most interesting moment, then "let me rewind" — don't start chronologically
- Show real environments, real situations — vlog energy is "I'm bringing you along"
- Mix direct-to-camera with "overheard" narration style
- Include ONE genuine unscripted-feeling reaction or vulnerability moment
- Time stamps and location labels on screen build narrative structure
- End with a reflection that ties the day/experience to a bigger theme
- Text-on-screen: times, locations, inner monologue captions, emoji reactions`,

  review: `REVIEW — Verdict First:
- LEAD WITH THE VERDICT: "This is the best/worst X I've tried. Here's why."
- Never save the conclusion for the end — that's a blog post, not a video
- Compare to something the audience already knows: "It's like X but better at Y"
- Be SPECIFIC: "battery lasted 6 hours of continuous use" not "great battery life"
- Include ONE genuine criticism even in positive reviews — credibility depends on it
- Text-on-screen: product name, price, specs, rating score — stuff viewers screenshot
- Use a rating system that's consistent — creates expectation for series potential`,
};

// ═══════════════════════════════════════════════════════════
// LENGTH INTELLIGENCE
// Scene count, word count, timing, pacing constraints
// ═══════════════════════════════════════════════════════════

const LENGTH_INTELLIGENCE: Record<string, string> = {
  "15s": `15-SECOND VIDEO constraints:
- MAX 3 scenes. Hook + value + cta. Every single word must earn its place.
- ~30-40 words total spoken. That's 2-3 SHORT sentences.
- Hook lands in 1 second. Skip context — go straight from hook to value.
- Text-on-screen carries 60%+ of the message — essential for sound-off viewers
- This is a SINGLE-PUNCH format: one idea, one takeaway, done. No build-up.
- LOOP MECHANIC IS CRITICAL at this length — ending must flow into beginning seamlessly
- Think of it as a billboard that talks`,

  "30s": `30-SECOND VIDEO constraints:
- 3-5 scenes. Room for hook + build + payoff.
- ~65-85 words total spoken. About 5-7 sentences.
- Timing: hook 2s → context 5s → value+proof 15s → CTA 5s
- Most versatile length — works for every format and platform
- Text-on-screen should update at each scene transition
- LOOP MECHANIC: ending should callback to opening for replay value
- A "retention checkpoint" at 15s — give a mini-payoff or tease what's coming to hold viewers through the second half`,

  "60s": `60-SECOND VIDEO constraints:
- 5-8 scenes. Full scene architecture available.
- ~140-170 words total spoken. About 10-14 sentences.
- You have room for real storytelling, multiple proof points, and a genuine build
- CRITICAL: add a PIVOT at the 30-second mark ("But here's what nobody tells you") — viewers drop off at the midpoint without a re-hook
- Pacing variation is essential at this length — uniform delivery loses viewers at 25-30s
- Text-on-screen should update every 5-7 seconds
- A "big event or small success" every 15-20 seconds to maintain momentum
- End with open loop or satisfying punchline — at 60s the ending determines share rate`,
};

// ═══════════════════════════════════════════════════════════
// PACE INTELLIGENCE
// WPM targets, energy levels, scene density
// ═══════════════════════════════════════════════════════════

const PACE_INTELLIGENCE: Record<string, string> = {
  normal: `NORMAL PACE:
- 130-150 words per minute. Natural, unhurried delivery.
- Steady conversational rhythm — like explaining to a friend over coffee
- Let ideas breathe. Natural pauses between thoughts.
- Standard scene density. Good depth per scene — 2-4 sentences each.
- Best for: educational, reviews, vlogs, trust-building content`,

  medium: `MEDIUM PACE:
- 150-170 words per minute. Engaged, conversational energy.
- Speed up through supporting details, slow down for key insights — the CONTRAST creates emphasis
- Mix sentence lengths: long setup → short punchy payoff
- Moderate scene density. Balance depth with momentum.
- This is the "creator talking to camera with coffee" energy — alert but not rushed`,

  fast: `FAST PACE:
- 170-190 words per minute. High energy, rapid delivery.
- Cut ALL dead air. Jump between ideas. No pauses except for dramatic effect.
- Short sentences. Fragments. Staccato rhythm. Machine gun delivery.
- High scene density — more scenes, less depth each. Rapid fire information.
- Every sentence must EARN its place — if it doesn't add value, cut it.
- Best for: listicles, trends, "things you didn't know", hype content
- 20% more energy than normal conversation. If it feels normal, it's too slow.`,
};

// ═══════════════════════════════════════════════════════════
// CONNECTION MODE INTELLIGENCE (for series)
// ═══════════════════════════════════════════════════════════

const CONNECTION_MODE_INTELLIGENCE: Record<string, string> = {
  sequential:
    "SEQUENTIAL series: each episode continues the story. End with cliffhanger or open question. Episode 2+ starts with a one-line callback (not a recap — a RE-HOOK that works for new viewers too). The series should feel like chapters of a book you can't put down.",
  anthology:
    "ANTHOLOGY series: same theme, standalone episodes. Each works alone but feels part of a collection. VARY the angle, structure, and hook pattern between episodes — repetitive anthology = dead series. Think: same universe, different stories.",
  running_format:
    "RUNNING FORMAT series: same recognizable structure, fresh content. Think of it like a TV show segment — the frame stays, the content changes. Lean into the ritual. Viewers should know the format within 2 seconds and feel comfortable in it.",
  journey:
    "JOURNEY series: track REAL progress. Reference specific past milestones naturally: 'remember when I said X? Here's what happened.' Show genuine growth, setbacks included — manufactured arcs read as fake. Each episode is a checkpoint.",
  response:
    "RESPONSE series: scripts that feel like replies to the audience. Reference real comment patterns: 'a lot of you asked about X' or 'someone said Y and honestly...' Make viewers feel HEARD. This builds community — the audience becomes co-creators of the series.",
};

// ═══════════════════════════════════════════════════════════
// PROMPT BUILDERS
// Each builder produces a self-contained prompt that works
// WITH the system prompt and voice DNA. They are all aware
// of what the other builders produce — same voice, same
// quality, same standards.
// ═══════════════════════════════════════════════════════════

export function buildScriptPrompt(params: ScriptGenerationParams): string {
  const platform =
    PLATFORM_INTELLIGENCE[params.platform] || PLATFORM_INTELLIGENCE.youtube;
  const format =
    FORMAT_STRUCTURES[params.format] || FORMAT_STRUCTURES.talking_head;
  const length = LENGTH_INTELLIGENCE[params.length] || LENGTH_INTELLIGENCE["30s"];
  const pace = PACE_INTELLIGENCE[params.pace] || PACE_INTELLIGENCE.medium;

  return `Write a ${params.format.replace("_", " ")} script about: ${params.topicDescription}

${platform}

${format}

${length}

${pace}

SCENE STRUCTURE:
- Available types: hook, context, value, proof, payoff, cta
- You DON'T need all 6 — a 15s TikTok might only need hook + value + cta. Merge or skip types if the flow is better without them.
- Each scene returns "content" (what the creator SAYS — spoken words, 6th grade reading level, their voice amplified) and "textOnScreen" (visual text that ADDS info the voice doesn't say)
- Title: catchy, under 60 characters, would make someone tap in a library view`;
}

export function buildSeriesEpisodePrompt(params: SeriesEpisodeParams): string {
  const platform =
    PLATFORM_INTELLIGENCE[params.platform] || PLATFORM_INTELLIGENCE.youtube;
  const format =
    FORMAT_STRUCTURES[params.format] || FORMAT_STRUCTURES.talking_head;
  const length = LENGTH_INTELLIGENCE[params.length] || LENGTH_INTELLIGENCE["30s"];
  const pace = PACE_INTELLIGENCE[params.pace] || PACE_INTELLIGENCE.medium;
  const mode =
    CONNECTION_MODE_INTELLIGENCE[params.connectionMode] || "";

  const previousContext =
    params.previousEpisodes.length > 0
      ? params.previousEpisodes
          .map(
            (ep) =>
              `Ep ${ep.episodeNumber} "${ep.title}": ${ep.scenes.map((s) => `[${s.type}] ${s.content}`).join(" | ")}`
          )
          .join("\n")
      : "First episode — establish the tone, hook style, and structure that will carry the series. Make it strong enough that viewers want episode 2.";

  return `Write episode ${params.episodeNumber} of "${params.seriesTitle}".
Topic: ${params.topicDescription}

${mode}

${platform}

${format}

${length}

${pace}

## Previous episodes (for continuity — reference ONLY where it serves the story)
${previousContext}

CONSISTENCY RULE: This episode must feel like it was written by the SAME person as previous episodes. Same voice, same energy, same structural patterns. A viewer should recognise the creator instantly.

Each scene: "content" (spoken, creator's voice) + "textOnScreen" (visual, adds info).
Title: catchy, under 60 characters.`;
}

export function buildRemixPrompt(params: RemixParams): string {
  const originalScenes = params.sourceScript.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const targetPlatform =
    PLATFORM_INTELLIGENCE[params.targetPlatform] ||
    PLATFORM_INTELLIGENCE.youtube;

  return `REMIX this script for ${params.targetPlatform}. This is a CREATIVE REIMAGINING — same creator, different platform.

## Source script (${params.sourceScript.platform})
"${params.sourceScript.title}"
${originalScenes}

## Target: ${params.targetPlatform}
${targetPlatform}

REMIX RULES:
- KEEP: the core insight, the creator's EXACT voice and personality, the value proposition
- CHANGE: structure, pacing, hook style, length, CTA style — everything that makes a ${params.sourceScript.platform} script feel wrong on ${params.targetPlatform}
- A good remix makes someone think "this was made for ${params.targetPlatform}" — not "this was adapted"
- The VOICE must be identical across platforms. Only the delivery changes.
- Adjust scene count to match ${params.targetPlatform}'s optimal length

Each scene: "content" (spoken, same creator voice as source) + "textOnScreen" (visual, adds info).
Title: catchy, under 60 characters, platform-native.`;
}

export function buildSceneRegenerationPrompt(
  params: SceneRegenerationParams
): string {
  const contextScenes = params.allScenes
    .filter((s) => s.order !== params.scene.order)
    .map((s) => `[Scene ${s.order} — ${s.type}]: ${s.content}`)
    .join("\n");

  return `Rewrite scene ${params.scene.order} (${params.scene.type}) of "${params.scriptTitle}" (${params.platform}).

## Current version (throw this away — start completely fresh)
"${params.scene.content}"

## Surrounding scenes (match their tone, energy, and voice EXACTLY)
${contextScenes}

REGENERATION RULES:
- Write a MEANINGFULLY DIFFERENT take. Change the angle, the example, the framing — not just synonyms.
- The new version must feel like it was written by the SAME creator in the SAME session as the surrounding scenes
- Keep the scene type (${params.scene.type}) and make it flow naturally between its neighbours
- Match the energy level of surrounding scenes — don't suddenly shift from chill to hype
- Apply the same 6th grade reading level, same spoken language style, same voice DNA

Return "content" (spoken, creator's voice) and "textOnScreen" (visual, adds info — never transcript).`;
}

export function buildCaptionPrompt(params: CaptionParams): string {
  const sceneSummary = params.scenes
    .map((s) => `[${s.type}]: ${s.content}`)
    .join("\n");

  const platformCaptionIntel: Record<string, string> = {
    tiktok: `TikTok caption intel:
- 1-2 lines max. Punchy, not polished.
- Include keywords for TikTok search (TikTok search is growing fast — treat it like SEO)
- Hashtags: 3-5 targeted, mix broad + niche. The 30-hashtag era is dead.
- NO emojis unless the creator's voice uses them. Caption should match video energy.`,

    youtube: `YouTube Shorts caption intel:
- Title matters MORE than description for Shorts. Make it searchable + clickable.
- Keywords help because Shorts appear in YouTube search
- Hashtags: #Shorts + 2-3 niche tags
- Description can be longer — YouTube surfaces it in search`,

    instagram: `Instagram caption intel:
- Longer captions WORK here (2-5 sentences, micro-blog style) — Instagram factors in reading time
- First line IS the hook — it appears in feed preview, treat it as a second headline
- CTA for saves: "save this for later" — saves are weighted heavily in Reels algorithm
- CTA for shares: "send this to someone who needs it" — shares weighted MOST heavily
- Hashtags: 5-10, mix of broad reach and niche-specific. Quality > quantity.`,
  };

  return `Write a caption and hashtags for "${params.scriptTitle}" on ${params.platform}.

## The script this caption accompanies (match its voice and energy EXACTLY)
${sceneSummary}

${platformCaptionIntel[params.platform] || platformCaptionIntel.youtube}

CAPTION RULES:
- Write in the SAME voice as the script above. The caption should feel like the creator typed it right after filming.
- First line = hook. Make someone stop scrolling in the feed.
- Include ONE specific CTA: save prompt, share prompt, or comment prompt — pick the one that matches the content
- Under 150 words. Punchy beats long.

HASHTAG RULES:
- Space-separated string, 5-15 hashtags
- Mix: broad reach + niche-specific + trending/topical
- No spaces or special characters in hashtags`;
}
