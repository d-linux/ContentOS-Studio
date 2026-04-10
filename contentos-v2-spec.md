# ContentOS Studio v2 — Full Spec

**Name:** ContentOS Studio
**Description:** Your Personal Video Director
**Role:** Short-form content script generator — the best one.

---

## Pages

### Main Pages

1. **Create** — where users generate scripts
2. **Library** — where scripts are stored
3. **Brand Brain** — where the user's AI context is stored

### Extra Pages

4. **Help** — Support + FAQ + Leave feedback (gain 1 free script generation)
5. **Billing** — Manage subscription + payment history + plan cancellation + plan display + plan renewal
6. **Settings** — Account + legal pages

---

## Brand Brain Fields

| Field        | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| Name         | Creator's name                                                         |
| Tone         | How they sound (casual, hype, sarcastic, etc.)                         |
| Niche        | What they talk about                                                   |
| About        | Freeform — anything about themselves, content plan, ideas, inspiration |
| Boundaries   | What the AI should never do or mention                                 |
| YouTube data | Auto-populated from the YouTube analyzer feedback loop                 |

**Onboarding:** First-time users are prompted to fill Brand Brain before generating their first script.

---

## Script Features

### Main Script Features

- **Title**
- **Scene-by-scene breakdown** — hooks, context, value, proof, payoff, CTA
- **Scene text on screen** — per scene
- **Scene regeneration** — x1 per scene, saves original + new, creator picks which to use
- **Scene editing** — manual edit of scene content
- **Scene speech reading** — text-to-speech playback of individual scenes

### Aside Script Features

- **Details** — platform, length, pace, format, scene count
- **Export** — PDF + Copy + Share + Teleprompter (scrolling, speeds: x1, x1.5, x2, x2.5)
- **Caption generation** — description + hashtags
- **Full voiceover** — all scenes combined into one readable paragraph (not AI audio)

---

## Create Page — Four Modes

### 1. Create from Own Idea

- User fills a form: topic description, platform, length, pace, format
- Script generates using Brand Brain context

### 2. Create from Trend (YouTube only)

- No form — topics are auto-generated from YouTube trend data matched to user's niche + Brand Brain
- Flow: see trending topic suggestions → pick one → script generates
- TikTok + Instagram trend sources to be added later when APIs are approved

### 3. Create Series

- User fills a form + picks a connection mode
- **Connection modes:**
  - **Sequential** — linear story, cliffhangers, "last time" recaps
  - **Anthology** — same theme, each episode standalone
  - **Running format** — same structure/premise, fresh content each time
  - **Journey** — tracks progress, references milestones
  - **Response** — scripts that feel like replies to audience engagement
- Each new episode is generated with full context of previous episodes

### 4. Remix

- Shows script cards inline (mini library picker within Create page — no need to go back to Library)
- User selects a script → opens remix form (pick target platform, adjust)
- Generates a completely new script optimized for the target platform's culture

### Create Form Fields

- Topic description
- Platform
- Length
- Pace
- Format (talking head, listicle, storytime, tutorial, etc.)

---

## Library Page

### Sections

- **All** — every script
- **Series** — grouped by serie

### Script Card Display

- Name
- Platform
- Quick hook preview
- Date
- Serie indicator (Part 1, Part 2, etc.) if applicable

### YouTube Analyzer (YouTube scripts only)

- Analyzer button on YouTube script cards
- Opens popup: paste the video URL
- Saves video performance data
- Feeds improvement insights back to Brand Brain
- Future scripts for YouTube benefit from real performance data

---

## Billing

- Current plan display
- Usage meter (scripts used / limit)
- Payment history / invoices
- Plan cancellation (visible, not buried)
- Plan renewal
- Upgrade/downgrade path

### Monetization

- **Free tier** — limited scripts per month
- **Paid tier** — higher limit
- **Referral** — 1 bonus script per referral
- **Extra credits** — £2.99 for 5 extra script generations

---

## Help Page

- Support contact
- FAQ
- Leave feedback → reward: 1 free script generation

---

## Settings

- Account management
- Legal pages (privacy, terms)

---

## Parked Features (Season 2 — when platform APIs are approved)

| Feature                                       | Revisit When                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Edit notes / shot directions                  | CapCut or editing tool integration                                                          |
| Virality score                                | Real performance data pipeline from YouTube/TikTok/Instagram                                |
| TikTok trends                                 | TikTok API approved                                                                         |
| Instagram trends                              | Instagram Graph API approved                                                                |
| Brand Brain import                            | Platform APIs for auto-importing creator content                                            |
| Full YouTube/TikTok/Instagram API integration | APIs approved — unlocks virality score, trends, auto-import, and analyzer for all platforms |

---

## Rebuild Approach

- New repo from zero
- Copy only .env.local from current project (same Stripe, Clerk, DB, Upstash, Sentry, etc.)
- Tech stack TBD
- Deploy to same Vercel project + domain when ready
