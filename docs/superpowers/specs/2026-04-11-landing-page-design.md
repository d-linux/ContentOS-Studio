# Landing Page Design — ContentOS Studio

## Routes

| Route    | Type   | Description                                              |
| -------- | ------ | -------------------------------------------------------- |
| `/`      | Public | Landing page. Signed-in users redirect to `/create`      |
| `/demo`  | Public | Demo video (YouTube embed) + guided tour                 |
| `/links` | Public | Linktree-style social links (Instagram, TikTok, YouTube) |
| `/blog`  | Public | Blog index — placeholder, posts added later              |

All under `(marketing)` route group with shared header + footer layout (no dashboard sidebar).

## Header (sticky, shared)

- Left: "ContentOS Studio" brand name
- Center: "Demo" → `/demo`
- Right: "Sign In" → `/sign-in` + "Get Started" button → `/sign-up`

## Landing Page (`/`)

### 1. Hero

- Headline: "Your Personal Video Director"
- Subtext: AI-powered script generation that learns your voice
- CTAs: "Get Started Free" → `/sign-up`, "Watch Demo" → `/demo`

### 2. Features Grid (4 cards)

- Own Idea — describe topic, get scene-by-scene script
- Trending Topics — YouTube trend-matched scripts for your niche
- Series — multi-episode scripts with 5 connection modes
- Remix — cross-platform script adaptation

### 3. Brand Brain Section

- AI learns creator's voice, niche, tone, boundaries
- YouTube Analyzer feedback loop for continuous improvement

### 4. Script Preview

- Visual mock of generated script output (scene breakdown, text on screen, teleprompter)

### 5. Pricing Table

- Free: 5 scripts/month, £0
- Pro: 25 scripts/month, £9.99/month
- Extra credits: £2.99 for 5 generations
- Referral: 1 bonus script per referral
- CTAs: "Start Free" / "Go Pro"

### 6. FAQ (4 questions)

- What platforms does it support?
- How does Brand Brain work?
- Can I cancel anytime?
- What's a script generation?

### 7. Footer CTA

- Final "Get Started Free" push + "Already have an account? Sign in"

## Demo Page (`/demo`)

- YouTube video embed (placeholder URL, swappable later)
- Guided tour: step-by-step walkthrough with mockups of Create → Script View → Library flow

## Links Page (`/links`)

- Brand name + tagline at top
- Linktree-style cards: Instagram, TikTok, YouTube (placeholder URLs)

## Blog Page (`/blog`)

- Blog index with placeholder "Coming soon" state
- Structure ready for adding posts later

## Footer (shared)

- Brand name + one-line tagline
- Links: Demo, Blog, Help, Privacy, Terms, Links
- Social icons: Instagram, TikTok, YouTube (placeholder URLs)
- Copyright line

## Tech Decisions

- `(marketing)` route group with own `layout.tsx` (header + footer, no sidebar)
- Server Components for all static pages
- `"use client"` only for smooth scroll behaviour
- Existing shadcn components: Card, Button, Badge, Separator
- Dark theme, zinc palette, existing design tokens
- Signed-in redirect handled in `(marketing)/layout.tsx` via Clerk `auth()`
