# ContentOS Studio v2 — App Overview

> Single source of truth. Updated with every feature, fix, or change.

---

## What Is ContentOS Studio?

ContentOS Studio is a full content production system and creator operating system. It helps creators plan, generate, manage, and optimize short-form video scripts across platforms — powered by AI that learns each creator's voice, style, and performance data over time.

**Canonical URL:** https://contentosstudio.com

---

## Current Status

**Phase:** Phase 1 complete (foundation built, ready for Phase 2: Core Backend)

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
| Create      | Not started | Script generation — four modes: Own Idea, Trend, Series, Remix |
| Library     | Not started | Script storage — All + Series sections, YouTube Analyzer       |
| Brand Brain | Not started | Creator AI context — tone, niche, boundaries, YouTube data     |
| Help        | Not started | Support, FAQ, feedback (1 free script reward)                  |
| Billing     | Not started | Plans, usage meter, invoices, cancellation, upgrade/downgrade  |
| Settings    | Not started | Account management, legal pages                                |

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

---

## Build Phases

### Phase 1: Foundation

- [x] Project setup (Next.js 16, TS, Tailwind v4, shadcn/ui, ESLint, Prettier, env validation)
- [x] Database schema (Drizzle + PostgreSQL — all tables from spec)
- [x] Auth (Clerk + proxy.ts for Next.js 16)
- [x] Security layer (Arcjet shield + bot detection + rate limiting, CSP headers)
- [x] tRPC v11 setup (base router, server caller, React provider, route handler)

### Phase 2: Core Backend

- [ ] Brand Brain CRUD
- [ ] Script generation engine (AI prompts, Zod output schemas)
- [ ] Script CRUD
- [ ] Series logic (connection modes, episode chaining)
- [ ] Trends (YouTube Data API + Redis caching)
- [ ] Remix logic
- [ ] Billing (Stripe checkout, webhooks, usage, credits, referrals)

### Phase 3: Frontend

- [ ] Layout + navigation (app shell, sidebar, responsive)
- [ ] Brand Brain page (forms, onboarding)
- [ ] Create page (four modes)
- [ ] Script view (scenes, regen, editing, speech, teleprompter, export)
- [ ] Library page (All, Series, YouTube analyzer)
- [ ] Billing page
- [ ] Help page
- [ ] Settings page

### Phase 4: Polish

- [ ] Email templates (Resend)
- [ ] Sentry + PostHog integration
- [ ] End-to-end testing
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
  Services: Upstash Redis, Resend, Sentry, PostHog
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

| Date       | Change                                       |
| ---------- | -------------------------------------------- |
| 2026-04-10 | Initial APP-OVERVIEW.md created from v2 spec |
| 2026-04-10 | Phase 1 complete: Next.js 16, shadcn/ui, Drizzle schema, Clerk + Arcjet middleware, tRPC v11, Prettier + ESLint |
