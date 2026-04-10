import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 10, 2026</p>
        </div>
      </div>

      <Separator />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-lg font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground">
            ContentOS Studio (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
            operates the web application at contentosstudio.com. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly:
          </p>
          <ul className="text-muted-foreground list-disc space-y-1 pl-6">
            <li>
              <strong>Account information</strong> — name, email address, and
              authentication data managed through Clerk.
            </li>
            <li>
              <strong>Brand Brain data</strong> — creator name, tone, niche,
              about section, and content boundaries you provide to personalise
              script generation.
            </li>
            <li>
              <strong>Scripts and content</strong> — scripts you generate, edit,
              and store within the platform.
            </li>
            <li>
              <strong>Payment information</strong> — billing details processed
              securely through Stripe. We do not store card numbers.
            </li>
            <li>
              <strong>YouTube data</strong> — video URLs and performance
              statistics you submit through the YouTube Analyzer.
            </li>
            <li>
              <strong>Feedback</strong> — content you submit through the
              feedback form.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">
            3. How We Use Your Information
          </h2>
          <ul className="text-muted-foreground list-disc space-y-1 pl-6">
            <li>
              Generate personalised scripts using AI based on your Brand Brain
              context.
            </li>
            <li>Process payments and manage your subscription.</li>
            <li>
              Send transactional emails (welcome, billing alerts, feedback
              confirmations).
            </li>
            <li>
              Improve our service through anonymised product analytics
              (PostHog).
            </li>
            <li>Monitor errors and performance (Sentry).</li>
            <li>
              Enforce rate limits and protect against abuse (Arcjet, Upstash
              Redis).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Third-Party Services</h2>
          <p className="text-muted-foreground">
            We use the following third-party services that may process your
            data:
          </p>
          <ul className="text-muted-foreground list-disc space-y-1 pl-6">
            <li>
              <strong>Clerk</strong> — authentication and user management.
            </li>
            <li>
              <strong>Stripe</strong> — payment processing.
            </li>
            <li>
              <strong>Anthropic (Claude API)</strong> — AI script generation.
              Your Brand Brain context and prompts are sent to generate scripts.
            </li>
            <li>
              <strong>YouTube Data API</strong> — fetching video statistics and
              trend data.
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery.
            </li>
            <li>
              <strong>Sentry</strong> — error tracking and performance
              monitoring.
            </li>
            <li>
              <strong>PostHog</strong> — product analytics.
            </li>
            <li>
              <strong>Vercel</strong> — hosting and serverless infrastructure.
            </li>
            <li>
              <strong>Upstash</strong> — Redis caching and rate limiting.
            </li>
            <li>
              <strong>Arcjet</strong> — bot protection and security.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Data Security</h2>
          <p className="text-muted-foreground">
            We implement security measures including: strict Content Security
            Policy headers, bot detection and rate limiting (Arcjet), input
            validation on all API endpoints (Zod), parameterised database
            queries (Drizzle ORM), webhook signature verification, and encrypted
            environment variables.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Data Retention</h2>
          <p className="text-muted-foreground">
            Your account data and scripts are retained for as long as your
            account is active. You may delete individual scripts at any time.
            Upon account deletion, all associated data is removed from our
            systems.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to: access, correct, or delete your personal
            data; export your scripts; withdraw consent for data processing; and
            lodge a complaint with a supervisory authority. Contact us at the
            email below to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Cookies</h2>
          <p className="text-muted-foreground">
            We use essential cookies for authentication (Clerk session) and
            analytics cookies (PostHog). Analytics cookies can be managed
            through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">9. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">10. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, please contact us
            through the Help page or email us at support@contentosstudio.com.
          </p>
        </section>
      </div>
    </div>
  );
}
