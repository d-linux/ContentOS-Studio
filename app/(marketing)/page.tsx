import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Lightbulb,
  TrendingUp,
  Layers,
  Repeat2,
  Brain,
  Video,
  Clapperboard,
  MessageSquareText,
  Monitor,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.3_0.02_264)_0%,transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="mr-1.5 h-3 w-3" />
            AI-Powered Script Generation
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your Personal
            <br />
            <span className="bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Video Director
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
            ContentOS Studio is the content production system that learns your
            voice. Generate scene-by-scene scripts, track trends, build series,
            and remix across platforms — all shaped by your unique style.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Watch Demo
            </Link>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            10 free scripts per month. No credit card required.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Four Ways to Create
            </h2>
            <p className="text-muted-foreground mt-3">
              Every script is scene-by-scene, with hooks, context, value, proof,
              payoff, and CTA built in.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="group relative overflow-hidden">
              <CardHeader>
                <div className="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <CardTitle>Own Idea</CardTitle>
                <CardDescription>
                  Describe your topic, pick your platform, length, pace, and
                  format. The AI generates a full scene-by-scene script using
                  your Brand Brain context.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden">
              <CardHeader>
                <div className="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>
                  See what&apos;s trending on YouTube matched to your niche.
                  Pick a topic and generate a script that rides the wave — no
                  form needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden">
              <CardHeader>
                <div className="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle>Series</CardTitle>
                <CardDescription>
                  Build multi-episode content with 5 connection modes:
                  sequential, anthology, running format, journey, or response.
                  Each episode knows what came before.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden">
              <CardHeader>
                <div className="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Repeat2 className="h-5 w-5" />
                </div>
                <CardTitle>Remix</CardTitle>
                <CardDescription>
                  Take any script and adapt it for a different platform. A
                  YouTube script becomes a TikTok script — completely rewritten
                  for the platform&apos;s culture.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Brain */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-xl">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Brand Brain</h2>
              <p className="text-muted-foreground text-lg">
                Your AI context layer. Tell it your name, tone, niche, content
                style, and boundaries — every script is shaped by who you are as
                a creator.
              </p>
              <ul className="text-muted-foreground space-y-3">
                {[
                  "Learns your unique voice and tone",
                  "Respects your content boundaries",
                  "Improves with YouTube performance data",
                  "First-time onboarding guides you through setup",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="text-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card space-y-4 rounded-xl border p-6">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-red-500" />
                <span className="text-sm font-semibold">
                  YouTube Analyzer Feedback Loop
                </span>
              </div>
              <Separator />
              <div className="text-muted-foreground space-y-3 text-sm">
                <p>
                  Paste any YouTube video URL to analyse its performance. Views,
                  likes, comments, and engagement data feed back into your Brand
                  Brain.
                </p>
                <p>
                  Future scripts benefit from real performance insights — not
                  just guesses. Your AI gets smarter with every video you
                  analyse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Script Preview */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Scene-by-Scene Scripts
            </h2>
            <p className="text-muted-foreground mt-3">
              Every script is broken into structured scenes with built-in tools.
            </p>
          </div>

          {/* Mock script preview */}
          <div className="bg-card mx-auto max-w-3xl overflow-hidden rounded-xl border">
            {/* Script header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    &quot;5 Mistakes New Creators Make&quot;
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">YouTube</Badge>
                    <Badge variant="outline">Talking Head</Badge>
                    <span className="text-muted-foreground text-xs">
                      6 scenes · Medium pace
                    </span>
                  </div>
                </div>
                <Clapperboard className="text-muted-foreground h-5 w-5" />
              </div>
            </div>

            {/* Scene cards */}
            <div className="divide-y">
              {[
                {
                  type: "Hook",
                  content:
                    '"I wasted 6 months making these mistakes. Here\'s what I wish someone told me on day one."',
                  screen: "TITLE: 5 Creator Mistakes",
                },
                {
                  type: "Context",
                  content:
                    '"When I started, I thought posting every day was the secret. It\'s not. Let me show you what actually matters..."',
                  screen: "B-ROLL: Calendar with X marks",
                },
                {
                  type: "Value",
                  content:
                    '"Mistake number one: chasing trends instead of building a niche. Here\'s why that kills your growth..."',
                  screen: "GRAPHIC: Niche vs Trend comparison",
                },
              ].map((scene, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs">{scene.type}</Badge>
                    <span className="text-muted-foreground text-xs">
                      Scene {i + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{scene.content}</p>
                  <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
                    <Monitor className="h-3 w-3" />
                    {scene.screen}
                  </div>
                </div>
              ))}

              <div className="text-muted-foreground p-5 text-center text-sm">
                + 3 more scenes (Proof, Payoff, CTA)
              </div>
            </div>

            {/* Script tools bar */}
            <div className="border-t p-4">
              <div className="flex flex-wrap items-center gap-3">
                {[
                  "Regenerate Scene",
                  "Edit Inline",
                  "Text-to-Speech",
                  "Teleprompter",
                  "Export PDF",
                  "Captions",
                ].map((tool) => (
                  <span
                    key={tool}
                    className="text-muted-foreground flex items-center gap-1 text-xs"
                  >
                    <MessageSquareText className="h-3 w-3" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Simple Pricing
            </h2>
            <p className="text-muted-foreground mt-3">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {/* Free */}
            <Card>
              <CardHeader className="space-y-4">
                <div>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for trying it out</CardDescription>
                </div>
                <div>
                  <span className="text-4xl font-bold">£0</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <Separator />
                <ul className="space-y-2.5">
                  {[
                    "10 script generations per month",
                    "All 4 creation modes",
                    "Brand Brain personalisation",
                    "Scene editing & regeneration",
                    "Teleprompter & export",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                    >
                      <Check className="text-foreground mt-0.5 h-4 w-4 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  Start Free
                </Link>
              </CardHeader>
            </Card>

            {/* Pro */}
            <Card className="relative border-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most Popular</Badge>
              </div>
              <CardHeader className="space-y-4">
                <div>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious creators</CardDescription>
                </div>
                <div>
                  <span className="text-4xl font-bold">£9.99</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <Separator />
                <ul className="space-y-2.5">
                  {[
                    "30 script generations per month",
                    "Everything in Free",
                    "YouTube Analyzer feedback loop",
                    "Priority generation speed",
                    "Series with episode chaining",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                    >
                      <Check className="text-foreground mt-0.5 h-4 w-4 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={buttonVariants({ className: "w-full" })}
                >
                  Go Pro
                </Link>
              </CardHeader>
            </Card>
          </div>

          {/* Extras */}
          <div className="text-muted-foreground mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-6 text-sm">
            <span>
              <strong className="text-foreground">Extra credits:</strong> £2.99
              for 5 generations
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              <strong className="text-foreground">Referral bonus:</strong> 1
              free script per referral
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="divide-y">
            {[
              {
                q: "What platforms does it support?",
                a: "YouTube, TikTok, and Instagram. Each script is optimised for the platform's culture, length, and style. TikTok and Instagram trend sources are coming soon.",
              },
              {
                q: "How does Brand Brain work?",
                a: "When you first sign up, you fill in your creator profile — name, tone, niche, and content boundaries. Every script you generate uses this context. The YouTube Analyzer feeds real performance data back in, so your AI improves over time.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel through the Billing page or Stripe customer portal. You keep access until the end of your billing period. No questions asked.",
              },
              {
                q: "What's a script generation?",
                a: "One generation creates a full scene-by-scene script with hooks, text on screen, and structured scenes. Scene regeneration (1x per scene) and editing don't count against your limit.",
              },
            ].map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Create?
          </h2>
          <p className="text-muted-foreground mt-3">
            Join ContentOS Studio and start generating scripts that sound like
            you.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
