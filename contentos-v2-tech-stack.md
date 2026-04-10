# ContentOS Studio v2 — Tech Stack

---

## Core Framework

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Next.js** (App Router) | Full-stack React framework |
| Language | **TypeScript** | Type safety across the entire codebase |
| Runtime | **Node.js** | Server-side execution |
| Hosting | **Vercel** | Deployment, CDN, serverless functions |

---

## Frontend

| Technology | Purpose |
|-----------|---------|
| **React** | UI library |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |

---

## Backend

| Technology | Purpose |
|-----------|---------|
| **tRPC** | End-to-end typesafe API layer |
| **Drizzle ORM** | Database queries + migrations |
| **PostgreSQL** | Primary database |

---

## Authentication & Security

| Technology | Purpose |
|-----------|---------|
| **Clerk** | Authentication, user management, session handling |
| **Upstash Redis** | Rate limiting per user/endpoint |
| **Arcjet** | Bot protection, email validation, attack detection, signup fraud prevention |
| **CSRF protection** | Next.js built-in + custom middleware |
| **Content Security Policy** | Strict CSP headers via middleware |
| **Input sanitization** | Zod validation on every API input — no raw user data touches the database or AI prompts |

### Security Hardening (v2 improvements)

- **Arcjet** — adds a dedicated security layer:
  - Bot detection (block automated abuse)
  - Rate limiting with token bucket + sliding window
  - Email validation on signup (block disposable/invalid emails)
  - Shield (attack detection — SQLi, XSS, path traversal)
  - Signup form protection (prevent fake accounts)
- **Strict CSP headers** — prevent XSS, clickjacking, data injection
- **API route protection** — every tRPC route validates auth + rate limits before execution
- **Webhook signature verification** — Stripe + any external webhook validated via signatures
- **Environment variable validation** — fail fast on startup if required secrets are missing
- **No raw SQL** — Drizzle ORM only, parameterized queries everywhere
- **Output sanitization** — AI-generated content sanitized before rendering to prevent prompt injection display

---

## AI

| Technology | Purpose |
|-----------|---------|
| **Anthropic Claude API** (@anthropic-ai/sdk) | Script generation, Brand Brain intelligence |

---

## Payments

| Technology | Purpose |
|-----------|---------|
| **Stripe** | Subscriptions, checkout, customer portal, webhooks |

---

## Email

| Technology | Purpose |
|-----------|---------|
| **Resend** | Transactional emails (welcome, billing, feedback confirmation) |

---

## Caching & Rate Limiting

| Technology | Purpose |
|-----------|---------|
| **Upstash Redis** | Response caching, rate limiting, daily usage counters |

---

## External APIs

| Technology | Purpose |
|-----------|---------|
| **YouTube Data API v3** | Trend data for YouTube scripts |

---

## Monitoring & Analytics

| Technology | Purpose |
|-----------|---------|
| **Sentry** | Error tracking, performance monitoring |
| **PostHog** | Product analytics, user behavior |

---

## Development & Quality

| Technology | Purpose |
|-----------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Zod** | Runtime schema validation (API inputs, AI outputs, env vars) |
| **Drizzle Kit** | Database migrations |
| **Git** | Version control |

---

## New Addition: Arcjet

Arcjet is the main security upgrade for v2. It provides a unified security layer that sits in front of the application:

```
Request → Arcjet (bot detection + rate limit + shield) → Clerk (auth) → tRPC (API) → Database
```

**Why Arcjet:**
- Single dependency for multiple security concerns
- Works natively with Next.js middleware
- Low latency — decision engine runs locally with cloud sync
- Covers gaps that Clerk + Upstash rate limiting alone don't address (bot traffic, attack patterns, disposable email signups)

---

## Architecture Summary

```
┌─────────────────────────────────────────────┐
│                   Vercel                     │
│  ┌───────────────────────────────────────┐   │
│  │           Next.js App Router          │   │
│  │  ┌─────────┐  ┌──────────────────┐   │   │
│  │  │ Frontend │  │    Middleware     │   │   │
│  │  │ React    │  │ Arcjet + Clerk   │   │   │
│  │  │ Tailwind │  │ CSP + CSRF       │   │   │
│  │  │ shadcn   │  └──────────────────┘   │   │
│  │  └─────────┘           │              │   │
│  │                  ┌─────┴─────┐        │   │
│  │                  │   tRPC    │        │   │
│  │                  │  + Zod    │        │   │
│  │                  └─────┬─────┘        │   │
│  │          ┌─────────────┼──────────┐   │   │
│  │          │             │          │   │   │
│  │    ┌─────┴──┐   ┌─────┴──┐  ┌────┴─┐│   │
│  │    │Drizzle │   │Claude  │  │Stripe││   │
│  │    │PostgreSQL  │API     │  │      ││   │
│  │    └────────┘   └────────┘  └──────┘│   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌──────────┐ ┌────────┐ ┌───────┐          │
│  │ Upstash  │ │ Resend │ │Sentry │          │
│  │ Redis    │ │        │ │       │          │
│  └──────────┘ └────────┘ └───────┘          │
└─────────────────────────────────────────────┘
```
