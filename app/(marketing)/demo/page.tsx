import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Clapperboard,
  Library,
  Lightbulb,
  Play,
  ArrowDown,
} from "lucide-react";

// Replace this with your actual YouTube video ID when ready
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

export default function DemoPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-6 py-16 text-center">
        <Badge variant="secondary" className="mb-6">
          <Play className="mr-1.5 h-3 w-3" />
          Product Demo
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          See ContentOS Studio in Action
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
          Watch how creators use ContentOS Studio to generate scripts, build
          series, and optimise their content workflow.
        </p>
      </section>

      {/* Video Embed */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border">
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="ContentOS Studio Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Guided Tour */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-3">
              From setup to finished script in three steps.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="grid items-center gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">
                    Set Up Your Brand Brain
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  First-time users are guided through an onboarding flow. Tell
                  the AI your name, tone of voice, niche, and content
                  boundaries. This is the context that makes every script sound
                  like you — not a generic AI.
                </p>
              </div>
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <Brain className="text-muted-foreground h-5 w-5" />
                  <span className="text-sm font-semibold">Brand Brain</span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  {[
                    { label: "Name", value: "Alex Chen" },
                    {
                      label: "Tone",
                      value: "Casual, direct, slightly sarcastic",
                    },
                    { label: "Niche", value: "Tech productivity for creators" },
                    {
                      label: "Boundaries",
                      value: "No clickbait, no fake urgency",
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <span className="text-muted-foreground text-xs">
                        {field.label}
                      </span>
                      <p className="text-sm">{field.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowDown className="text-muted-foreground h-6 w-6" />
            </div>

            {/* Step 2 */}
            <div className="grid items-center gap-8 sm:grid-cols-2">
              <div className="order-2 space-y-4 sm:order-1">
                <Card className="p-6">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="text-muted-foreground h-5 w-5" />
                    <span className="text-sm font-semibold">Create Script</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    {[
                      {
                        label: "Topic",
                        value: "Why most creators quit in 90 days",
                      },
                      { label: "Platform", value: "YouTube" },
                      { label: "Length", value: "3-5 minutes" },
                      { label: "Format", value: "Talking Head" },
                      { label: "Pace", value: "Medium" },
                    ].map((field) => (
                      <div key={field.label}>
                        <span className="text-muted-foreground text-xs">
                          {field.label}
                        </span>
                        <p className="text-sm">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div className="order-1 space-y-4 sm:order-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">
                    Pick a Mode and Generate
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Choose from four creation modes: Own Idea, Trending Topics,
                  Series, or Remix. Fill in a few details — the AI handles the
                  rest. Scene-by-scene scripts generate in seconds with hooks,
                  text on screen, and CTAs built in.
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowDown className="text-muted-foreground h-6 w-6" />
            </div>

            {/* Step 3 */}
            <div className="grid items-center gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">
                    Edit, Rehearse, and Export
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Fine-tune any scene inline, regenerate ones you don&apos;t
                  love, and use the built-in teleprompter with 4 speed settings
                  to rehearse. Export as PDF, copy to clipboard, or generate
                  captions and hashtags. Your library keeps everything
                  organised.
                </p>
              </div>
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <Library className="text-muted-foreground h-5 w-5" />
                  <span className="text-sm font-semibold">Script Tools</span>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-2">
                  {[
                    "Edit Scenes",
                    "Regenerate (1x)",
                    "Text-to-Speech",
                    "Teleprompter",
                    "Export PDF",
                    "Copy",
                    "Captions",
                    "Voiceover",
                    "YouTube Analyzer",
                  ].map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-xs">
                      <Clapperboard className="mr-1 h-3 w-3" />
                      {tool}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
