# ContentOS Studio v2 — Build Order

---

## Phase 1: Foundation

| #   | Task                                                                                    | Why first                                |
| --- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1   | Project setup — Next.js, TypeScript, Tailwind, shadcn, ESLint, Prettier, env validation | Everything depends on this               |
| 2   | Database schema — Drizzle + PostgreSQL, all tables designed upfront from spec           | Source of truth everything builds on     |
| 3   | Auth — Clerk setup + middleware (protected/public routes)                               | Every route needs auth context           |
| 4   | Security layer — Arcjet middleware, CSP headers, CSRF protection                        | Must be in place before any routes exist |
| 5   | tRPC setup — base router, context with auth + rate limiting                             | API foundation for all features          |

---

## Phase 2: Core Backend

| #   | Task                                                                             | Depends on                          |
| --- | -------------------------------------------------------------------------------- | ----------------------------------- |
| 6   | Brand Brain — CRUD routes                                                        | Auth + DB schema                    |
| 7   | Script generation engine — AI prompts, Zod output schemas, core generation logic | Brand Brain (needs creator context) |
| 8   | Script CRUD — save, read, update, delete scripts                                 | DB schema + auth                    |
| 9   | Series logic — connection modes, episode context chaining                        | Script generation + CRUD            |
| 10  | Trends — YouTube Data API integration + Redis caching                            | tRPC + Upstash                      |
| 11  | Remix logic — cross-platform script regeneration                                 | Script generation engine            |
| 12  | Billing — Stripe checkout, webhooks, usage tracking, extra credits, referrals    | Auth + DB schema                    |

---

## Phase 3: Frontend

| #   | Task                                                                              | Depends on           |
| --- | --------------------------------------------------------------------------------- | -------------------- |
| 13  | Layout + navigation — app shell, sidebar, responsive structure                    | Project setup        |
| 14  | Brand Brain page — forms, onboarding flow                                         | Brand Brain API      |
| 15  | Create page — four modes (own idea, trend, series, remix)                         | All generation APIs  |
| 16  | Script view — scene display, regen, editing, speech reading, teleprompter, export | Script CRUD API      |
| 17  | Library page — All + Series sections, script cards, YouTube analyzer              | Script + Series APIs |
| 18  | Billing page — plans, usage meter, invoices, cancellation                         | Billing API          |
| 19  | Help page — FAQ, support, feedback form (1 free script reward)                    | Basic layout         |
| 20  | Settings page — account, legal pages                                              | Auth                 |

---

## Phase 4: Polish

| #   | Task                                                                      | Depends on         |
| --- | ------------------------------------------------------------------------- | ------------------ |
| 21  | Email templates — Resend (welcome, billing alerts, feedback confirmation) | Billing + Auth     |
| 22  | Sentry + PostHog — error tracking, product analytics                      | Full app working   |
| 23  | Testing — end-to-end flows across all features                            | Everything         |
| 24  | Deploy — connect new repo to Vercel, repoint domain                       | Everything passing |

---

## Why This Order

- **Database first** — wrong schema forces rewrites everywhere
- **Backend before frontend** — frontend is a UI over the API; solid API = straightforward UI
- **Brand Brain before scripts** — script generation depends on Brand Brain context
- **Billing late** — important but independent of core product logic
- **Polish last** — emails, monitoring, analytics don't change the product
