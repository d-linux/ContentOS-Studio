# ContentOS Studio — Pages Registry

> Updated whenever a new page is created. Tracks route, status, and purpose.

---

| Page        | Route                     | Status | Description                                                   |
| ----------- | ------------------------- | ------ | ------------------------------------------------------------- |
| Home        | `/`                       | Built  | Redirects to /create                                          |
| Create      | `/create`                 | Built  | Script generation — Own Idea, Trend, Series, Remix modes      |
| Library     | `/library`                | Built  | Script storage — All + Series sections, YouTube Analyzer      |
| Brand Brain | `/brand-brain`            | Built  | Creator AI context — tone, niche, boundaries, YouTube data    |
| Script View | `/script/[id]`            | Built  | Scene display, regen, edit, speech, teleprompter, export      |
| Help        | `/help`                   | Built  | Support, FAQ, feedback form (1 free script reward)            |
| Billing     | `/billing`                | Built  | Plans, usage meter, invoices, cancellation, upgrade/downgrade |
| Settings    | `/settings`               | Built  | Account management, legal pages                               |
| Sign In     | `/sign-in`                | Built  | Clerk sign-in page                                            |
| Sign Up     | `/sign-up`                | Built  | Clerk sign-up page                                            |

---

## Route Groups

- `(dashboard)` — All main app pages with sidebar layout
- `(auth)` — Sign-in/sign-up with centered minimal layout

## Notes

- Brand Brain onboarding is shown to first-time users before their first script generation
- Create page contains an inline mini library picker for Remix mode
- Library has a YouTube Analyzer popup on YouTube script cards
