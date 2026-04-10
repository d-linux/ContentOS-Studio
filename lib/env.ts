import { z } from "zod/v4";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.url(),

  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),

  // Arcjet
  ARCJET_KEY: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().min(1),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // YouTube
  YOUTUBE_API_KEY: z.string().min(1),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

// Validate at import time — fail fast on missing/invalid env vars
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2)
  );
  throw new Error("Invalid environment variables. Check server logs.");
}

export const env = parsed.data;
