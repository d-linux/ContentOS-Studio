# ContentOS Studio v2 — App Overview

> Single source of truth. Updated with every feature, fix, or change.

---

## What Is ContentOS Studio?

ContentOS Studio is a full content production system and creator operating system. It helps creators plan, generate, manage, and optimize short-form video scripts across platforms — powered by AI that learns each creator's voice, style, and performance data over time.

**Canonical URL:** https://contentosstudio.com

---

## Current Status

**Phase:** Phase 4 near-complete (legal pages, E2E tests, deploy config done — final step: deploy to Vercel)

---

## Tech Stack

| Layer              | Technology                                        |
| ------------------ | ------------------------------------------------- |
| Framework          | Next.js (App Router) + TypeScript                 |
| Frontend           | React, Tailwind CSS, shadcn/ui                    |
| API                | tRPC + Zod                                        |
| Database           | PostgreSQL + Drizzle ORM                          |
| Auth               | Clerk                                             |
| AI                 | Anthropic Claude API (@anthropic-ai/sdk)          |
| Payments           | Stripe                                            |
| Email              | Resend                                            |
| Cache / Rate Limit | Upstash Redis                                     |
| Security           | Arcjet (bot protection, shield, email validation) |
| Monitoring         | Sentry (errors), PostHog (analytics)              |
| External APIs      | YouTube Data API v3                               |
| Hosting            | Vercel                                            |

---

## Pages

| Page        | Status      | Description                                                    |
| ----------- | ----------- | -------------------------------------------------------------- |
| Create      | Built | Script generation — four modes: Own Idea, Trend, Series, Remix |
| Library     | Built | Script storage — All + Series sections, YouTube Analyzer       |
| Brand Brain | Built | Creator AI context — tone, niche, boundaries, YouTube data     |
| Help        | Built | Support, FAQ, feedback (1 free script reward)                  |
| Billing     | Built | Plans, usage meter, invoices, cancellation, upgrade/downgrade  |
| Settings    | Built | Account management, legal pages                                |
| Script View | Built | Scene display, regen, edit, speech, teleprompter, export       |
| Sign In     | Built | Clerk sign-in page                                             |
| Sign Up     | Built | Clerk sign-up page                                             |
| Privacy     | Built | Privacy Policy page                                            |
| Terms       | Built | Terms of Service page                                          |
| Landing     | Built | Marketing landing page — hero, features, pricing, FAQ          |
| Demo        | Built | Product demo — YouTube embed + guided tour                     |
| Links       | Built | Linktree-style social links                                    |
| Blog        | Built | Blog index — coming soon placeholder                           |

---

## Features Built

- **Next.js 16 scaffold** — App Router, TypeScript, Tailwind CSS v4, React 19
- **shadcn/ui** — component library initialized with Button component
- **Zod env validation** — `lib/env.ts` validates all secrets at startup, fails fast
- **Drizzle ORM + PostgreSQL schema** — full schema: users, brand_brains, scripts, scenes, series, script_captions, youtube_analyses, referrals, feedback (with relations)
- **Clerk auth** — `proxy.ts` (Next.js 16) with public/protected route matching
- **Arcjet security** — shield, bot detection, token bucket rate limiting in proxy
- **CSP + security headers** — strict Content-Security-Policy, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **tRPC v11** — base router, server caller for RSCs, React provider for client components, route handler at `/api/trpc`
- **Middleware pipeline** — Arcjet (bot + rate limit + shield) → Clerk (auth) → route
- **Prettier + ESLint** — configured with Tailwind plugin, eslint-config-prettier, zero warnings
- **Brand Brain CRUD** — tRPC router: get + upsert, auto-marks onboarding complete on first create
- **Script generation engine** — Anthropic Claude API with `messages.parse` + `zodOutputFormat` for structured scene-by-scene output
- **Script CRUD** — create (with AI generation + usage deduction), list, getById (with scenes + caption), delete, scene regeneration (1x), scene editing, caption generation, voiceover assembly
- **Series logic** — 5 connection modes (sequential, anthology, running_format, journey, response), full episode context chaining, series CRUD
- **Trends** — YouTube Data API v3 search by user niche, Redis-cached (1hr TTL), generate script from trending topic
- **Remix** — cross-platform script regeneration with AI, preserves remix source reference
- **Billing** — Stripe checkout (subscription + one-time credits), customer portal, webhook handler (checkout.session.completed, subscription.updated/deleted, invoice.paid), referral system
- **YouTube Analyzer** — fetch video stats from YouTube API, generate engagement insights, feed data back to Brand Brain
- **Feedback** — submit feedback and earn 1 free script credit
- **App shell + sidebar** — SidebarProvider layout with 6 navigation items, Clerk UserButton
- **Brand Brain page** — form with name, tone, niche, about, boundaries fields, character counts
- **Create page** — tabbed interface with 4 modes (Own Idea, Trend, Series, Remix), all forms wired to tRPC
- **Script view** — scene-by-scene display, regeneration (1x), inline editing, text-to-speech, teleprompter (4 speeds), copy, caption generation, voiceover, delete
- **Library page** — All + Series tabs, script cards with platform/mode badges, YouTube Analyzer dialog
- **Billing page** — plan display, usage meter with progress bar, Stripe checkout, credits purchase, customer portal, referral system
- **Help page** — FAQ accordion, support contact, feedback form (+1 free credit)
- **Settings page** — Clerk UserProfile, legal links
- **Auth pages** — Clerk sign-in/sign-up with route groups
- **Transactional emails (Resend)** — 6 templates: welcome, subscription activated, subscription cancelled, credits purchased, usage reset, feedback thanks. Non-throwing sendEmail utility, wired to Stripe webhook + Clerk webhook + feedback router
- **Clerk webhook** — `user.created` event handler creates DB user record + sends welcome email, verified via `verifyWebhook()`
- **Sentry error monitoring** — `@sentry/nextjs` with client/server/edge configs, Session Replay, `withSentryConfig` source map upload, `/monitoring` tunnel route, `global-error.tsx` boundary, `instrumentation.ts` for server-side registration
- **PostHog analytics** — `@posthog/next` with `PostHogProvider`, auto pageview tracking, `/ingest` reverse proxy, Clerk user identification in dashboard layout
- **Privacy Policy page** — full privacy policy covering data collection, third-party services, security, data retention, user rights, cookies
- **Terms of Service page** — full terms covering subscriptions, acceptable use, content ownership, AI-generated content disclaimer, YouTube data, liability
- **E2E testing (Playwright)** — test suites for navigation (public/protected route redirects), API security (tRPC auth, webhook signature verification), security headers (CSP, X-Frame-Options, Permissions-Policy), rate limiting
- **Deploy config (vercel.json)** — function duration limits for tRPC (60s) and webhooks (30s)
- **Landing page** — full marketing page with hero, 4-feature grid, Brand Brain section, script preview mock, pricing table (Free £0/10 scripts, Pro £9.99/30 scripts), FAQ, footer CTA
- **Demo page** — YouTube video embed (placeholder) + 3-step guided tour (Brand Brain → Create → Edit/Export)
- **Links page** — linktree-style social links (Instagram, TikTok, YouTube placeholders)
- **Blog page** — blog index with coming soon placeholder
- **Marketing layout** — `(marketing)` route group with sticky header (Demo link, Sign In, Get Started), footer (links, social, copyright), auth redirect for signed-in users

---

## Build Phases

### Phase 1: Foundation

- [x] Project setup (Next.js 16, TS, Tailwind v4, shadcn/ui, ESLint, Prettier, env validation)
- [x] Database schema (Drizzle + PostgreSQL — all tables from spec)
- [x] Auth (Clerk + proxy.ts for Next.js 16)
- [x] Security layer (Arcjet shield + bot detection + rate limiting, CSP headers)
- [x] tRPC v11 setup (base router, server caller, React provider, route handler)

### Phase 2: Core Backend

- [x] Brand Brain CRUD (get + upsert, onboarding trigger)
- [x] Script generation engine (Claude API + zodOutputFormat structured output)
- [x] Script CRUD (create, list, get, delete, scene regen, scene edit, caption gen, voiceover)
- [x] Series logic (5 connection modes, episode context chaining)
- [x] Trends (YouTube Data API v3 + Redis caching)
- [x] Remix logic (cross-platform regeneration)
- [x] Billing (Stripe checkout, webhooks, portal, credits, referrals)
- [x] YouTube Analyzer (video stats + Brand Brain feedback loop)
- [x] Feedback (submit + earn credit)

### Phase 3: Frontend

- [x] Layout + navigation (sidebar with SidebarProvider, route groups for dashboard + auth)
- [x] Brand Brain page (form with all fields, character counts)
- [x] Create page (4 tabbed modes: Own Idea, Trend, Series, Remix)
- [x] Script view (scenes, regen 1x, inline edit, TTS, teleprompter 4 speeds, copy, caption, voiceover)
- [x] Library page (All + Series tabs, script cards, YouTube Analyzer dialog)
- [x] Billing page (plan display, usage meter, Stripe checkout, credits, portal, referrals)
- [x] Help page (FAQ accordion, support, feedback form +1 credit)
- [x] Settings page (Clerk UserProfile, legal links)
- [x] Auth pages (Clerk sign-in/sign-up)

### Phase 4: Polish

- [x] Email templates (Resend) — 6 templates, Clerk webhook for user creation + welcome, wired to all billing events + feedback
- [x] Sentry + PostHog integration — error monitoring with Session Replay, product analytics with pageview tracking + user identification
- [x] End-to-end testing (Playwright — navigation, API, security headers, rate limiting)
- [x] Deploy config (vercel.json with function durations)
- [ ] Deploy to Vercel + domain connection

---

## Architecture

```
Request -> Arcjet (bot + rate limit + shield) -> Clerk (auth) -> tRPC (API) -> Database
```

```
Vercel
  Next.js App Router
    Frontend: React + Tailwind + shadcn/ui
    Middleware: Arcjet + Clerk + CSP + CSRF
    API: tRPC + Zod
    Data: Drizzle -> PostgreSQL
    AI: Claude API
    Payments: Stripe
  Monitoring: Sentry (errors + replay), PostHog (analytics)
  Services: Upstash Redis, Resend
```

---

## Parked Features (Season 2)

| Feature                      | Revisit When                   |
| ---------------------------- | ------------------------------ |
| Edit notes / shot directions | CapCut integration             |
| Virality score               | Real performance data pipeline |
| TikTok trends                | TikTok API approved            |
| Instagram trends             | Instagram Graph API approved   |
| Brand Brain auto-import      | Platform APIs approved         |

---

## Changelog

| Date       | Change                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-10 | Initial APP-OVERVIEW.md created from v2 spec                                                                              |
| 2026-04-10 | Phase 1 complete: Next.js 16, shadcn/ui, Drizzle schema, Clerk + Arcjet middleware, tRPC v11, Prettier + ESLint           |
| 2026-04-10 | Phase 2 complete: Brand Brain, Script gen engine, Script CRUD, Series, Trends, Remix, Billing, YouTube Analyzer, Feedback |
| 2026-04-10 | Phase 3 complete: All frontend pages built — layout, Brand Brain, Create (4 modes), Script view, Library, Billing, Help, Settings, Auth |
| 2026-04-10 | Phase 4.1: Email templates (Resend) — 6 transactional emails, Clerk user.created webhook, sendEmail utility, wired to Stripe webhook + feedback router |
| 2026-04-10 | Phase 4.2: Sentry + PostHog — @sentry/nextjs with Session Replay + source maps + tunnel, @posthog/next with auto pageview + user identification |
| 2026-04-10 | Phase 4.3: Legal pages (Privacy Policy + Terms of Service), E2E testing (Playwright — navigation, API, security), deploy config (vercel.json) |
| 2026-04-11 | Marketing pages: landing page (hero, features, Brand Brain, script preview, pricing, FAQ), demo page (YouTube embed + guided tour), links page, blog placeholder, (marketing) route group with header/footer |
