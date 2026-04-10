"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, TrendingUp, Layers, Shuffle, Loader2 } from "lucide-react";

const PLATFORMS = [
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
];

const PACES = [
  { value: "slow", label: "Slow" },
  { value: "medium", label: "Medium" },
  { value: "fast", label: "Fast" },
];

const FORMATS = [
  { value: "talking_head", label: "Talking Head" },
  { value: "listicle", label: "Listicle" },
  { value: "storytime", label: "Storytime" },
  { value: "tutorial", label: "Tutorial" },
  { value: "skit", label: "Skit" },
  { value: "vlog", label: "Vlog" },
  { value: "review", label: "Review" },
];

const CONNECTION_MODES = [
  {
    value: "sequential",
    label: "Sequential",
    desc: "Linear story with cliffhangers",
  },
  {
    value: "anthology",
    label: "Anthology",
    desc: "Same theme, standalone episodes",
  },
  {
    value: "running_format",
    label: "Running Format",
    desc: "Same structure, fresh content",
  },
  { value: "journey", label: "Journey", desc: "Track progress and milestones" },
  {
    value: "response",
    label: "Response",
    desc: "Replies to audience engagement",
  },
];

type Platform = "youtube" | "tiktok" | "instagram";
type Pace = "slow" | "medium" | "fast";
type Format =
  | "talking_head"
  | "listicle"
  | "storytime"
  | "tutorial"
  | "skit"
  | "vlog"
  | "review";

export default function CreatePage() {
  const router = useRouter();
  const trpc = useTRPC();

  // ─── Own Idea form ──────────────────────────
  const [ownIdea, setOwnIdea] = useState({
    topicDescription: "",
    platform: "" as Platform | "",
    length: "",
    pace: "" as Pace | "",
    format: "" as Format | "",
  });

  const createMutation = useMutation(
    trpc.script.create.mutationOptions({
      onSuccess: (script) => {
        toast.success("Script generated!");
        router.push(`/script/${script.id}`);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  // ─── Trend ──────────────────────────────────
  const { data: trends, isLoading: trendsLoading } = useQuery(
    trpc.trends.getTopics.queryOptions()
  );

  const [trendForm, setTrendForm] = useState({
    length: "",
    pace: "" as Pace | "",
    format: "" as Format | "",
  });

  const trendMutation = useMutation(
    trpc.trends.generateFromTrend.mutationOptions({
      onSuccess: (script) => {
        toast.success("Script generated from trend!");
        router.push(`/script/${script.id}`);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  // ─── Series ─────────────────────────────────
  const { data: seriesList } = useQuery(trpc.series.list.queryOptions());

  const [seriesForm, setSeriesForm] = useState({
    seriesId: "",
    newSeriesTitle: "",
    connectionMode: "",
    platform: "" as Platform | "",
    topicDescription: "",
    length: "",
    pace: "" as Pace | "",
    format: "" as Format | "",
  });

  const createSeriesMutation = useMutation(
    trpc.series.create.mutationOptions({
      onSuccess: (newSeries) => {
        setSeriesForm((prev) => ({ ...prev, seriesId: newSeries.id }));
        toast.success("Series created!");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const generateEpisodeMutation = useMutation(
    trpc.series.generateEpisode.mutationOptions({
      onSuccess: (script) => {
        toast.success("Episode generated!");
        router.push(`/script/${script.id}`);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  // ─── Remix ──────────────────────────────────
  const { data: allScripts } = useQuery(trpc.script.list.queryOptions());

  const [remixForm, setRemixForm] = useState({
    sourceScriptId: "",
    targetPlatform: "" as Platform | "",
  });

  const remixMutation = useMutation(
    trpc.remix.create.mutationOptions({
      onSuccess: (script) => {
        toast.success("Remix generated!");
        router.push(`/script/${script.id}`);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create</h1>
        <p className="text-muted-foreground">
          Generate a new script using one of four modes.
        </p>
      </div>

      <Tabs defaultValue="own-idea">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="own-idea" className="gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Own Idea
          </TabsTrigger>
          <TabsTrigger value="trend" className="gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Trend
          </TabsTrigger>
          <TabsTrigger value="series" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            Series
          </TabsTrigger>
          <TabsTrigger value="remix" className="gap-1.5">
            <Shuffle className="h-3.5 w-3.5" />
            Remix
          </TabsTrigger>
        </TabsList>

        {/* ── Own Idea ─────────────────────────────── */}
        <TabsContent value="own-idea">
          <Card>
            <CardHeader>
              <CardTitle>Create from Own Idea</CardTitle>
              <CardDescription>
                Describe your topic and we&apos;ll generate a script using your
                Brand Brain context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!ownIdea.platform || !ownIdea.pace || !ownIdea.format)
                    return;
                  createMutation.mutate({
                    topicDescription: ownIdea.topicDescription,
                    platform: ownIdea.platform,
                    length: ownIdea.length,
                    pace: ownIdea.pace,
                    format: ownIdea.format,
                  });
                }}
              >
                <div className="space-y-2">
                  <Label>Topic Description</Label>
                  <Textarea
                    placeholder="What's the video about? Be as detailed as you want..."
                    value={ownIdea.topicDescription}
                    onChange={(e) =>
                      setOwnIdea((p) => ({
                        ...p,
                        topicDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={ownIdea.platform}
                      onValueChange={(v) =>
                        setOwnIdea((p) => ({ ...p, platform: v as Platform }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Length</Label>
                    <Input
                      placeholder="e.g. 30s, 60s, 3min"
                      value={ownIdea.length}
                      onChange={(e) =>
                        setOwnIdea((p) => ({ ...p, length: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pace</Label>
                    <Select
                      value={ownIdea.pace}
                      onValueChange={(v) =>
                        setOwnIdea((p) => ({ ...p, pace: v as Pace }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pace" />
                      </SelectTrigger>
                      <SelectContent>
                        {PACES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select
                      value={ownIdea.format}
                      onValueChange={(v) =>
                        setOwnIdea((p) => ({ ...p, format: v as Format }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMATS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Script
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Trend ────────────────────────────────── */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Create from Trend</CardTitle>
              <CardDescription>
                Pick a trending topic matched to your niche. YouTube only for
                now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendsLoading ? (
                <div className="text-muted-foreground py-8 text-center">
                  Loading trending topics...
                </div>
              ) : trends && trends.length > 0 ? (
                <div className="space-y-3">
                  {trends.map((trend) => (
                    <button
                      key={trend.sourceVideoId}
                      type="button"
                      className="hover:bg-muted w-full rounded-lg border p-3 text-left transition-colors"
                      onClick={() => {
                        if (
                          !trendForm.pace ||
                          !trendForm.format ||
                          !trendForm.length
                        ) {
                          toast.error("Fill in length, pace, and format first");
                          return;
                        }
                        trendMutation.mutate({
                          trendTitle: trend.title,
                          trendDescription: trend.description,
                          length: trendForm.length,
                          pace: trendForm.pace,
                          format: trendForm.format,
                        });
                      }}
                    >
                      <p className="font-medium">{trend.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {trend.sourceChannelTitle} &middot;{" "}
                        {Number(trend.viewCount).toLocaleString()} views
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  Set your niche in Brand Brain to see trending topics.
                </p>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Input
                    placeholder="e.g. 60s"
                    value={trendForm.length}
                    onChange={(e) =>
                      setTrendForm((p) => ({ ...p, length: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pace</Label>
                  <Select
                    value={trendForm.pace}
                    onValueChange={(v) =>
                      setTrendForm((p) => ({ ...p, pace: v as Pace }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pace" />
                    </SelectTrigger>
                    <SelectContent>
                      {PACES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={trendForm.format}
                    onValueChange={(v) =>
                      setTrendForm((p) => ({ ...p, format: v as Format }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {trendMutation.isPending && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating from trend...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Series ───────────────────────────────── */}
        <TabsContent value="series">
          <Card>
            <CardHeader>
              <CardTitle>Create Series Episode</CardTitle>
              <CardDescription>
                Generate connected episodes with context from previous ones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {seriesList && seriesList.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Series</Label>
                  <Select
                    value={seriesForm.seriesId}
                    onValueChange={(v) =>
                      setSeriesForm((p) => ({ ...p, seriesId: v ?? "" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a series or create new" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesList.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!seriesForm.seriesId && (
                <div className="space-y-4 rounded-lg border p-4">
                  <p className="text-sm font-medium">Create New Series</p>
                  <div className="space-y-2">
                    <Label>Series Title</Label>
                    <Input
                      placeholder="Name your series"
                      value={seriesForm.newSeriesTitle}
                      onChange={(e) =>
                        setSeriesForm((p) => ({
                          ...p,
                          newSeriesTitle: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Connection Mode</Label>
                      <Select
                        value={seriesForm.connectionMode}
                        onValueChange={(v) =>
                          setSeriesForm((p) => ({
                            ...p,
                            connectionMode: v ?? "",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONNECTION_MODES.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              <div>
                                <span>{m.label}</span>
                                <span className="text-muted-foreground ml-2 text-xs">
                                  {m.desc}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={seriesForm.platform}
                        onValueChange={(v) =>
                          setSeriesForm((p) => ({
                            ...p,
                            platform: v as Platform,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (
                        !seriesForm.newSeriesTitle ||
                        !seriesForm.connectionMode ||
                        !seriesForm.platform
                      )
                        return;
                      createSeriesMutation.mutate({
                        title: seriesForm.newSeriesTitle,
                        connectionMode: seriesForm.connectionMode as
                          | "sequential"
                          | "anthology"
                          | "running_format"
                          | "journey"
                          | "response",
                        platform: seriesForm.platform,
                      });
                    }}
                    disabled={createSeriesMutation.isPending}
                  >
                    Create Series
                  </Button>
                </div>
              )}

              {seriesForm.seriesId && (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!seriesForm.pace || !seriesForm.format) return;
                    generateEpisodeMutation.mutate({
                      seriesId: seriesForm.seriesId,
                      topicDescription: seriesForm.topicDescription,
                      length: seriesForm.length,
                      pace: seriesForm.pace as Pace,
                      format: seriesForm.format as Format,
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Label>Episode Topic</Label>
                    <Textarea
                      placeholder="What's this episode about?"
                      value={seriesForm.topicDescription}
                      onChange={(e) =>
                        setSeriesForm((p) => ({
                          ...p,
                          topicDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Length</Label>
                      <Input
                        placeholder="e.g. 60s"
                        value={seriesForm.length}
                        onChange={(e) =>
                          setSeriesForm((p) => ({
                            ...p,
                            length: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pace</Label>
                      <Select
                        value={seriesForm.pace}
                        onValueChange={(v) =>
                          setSeriesForm((p) => ({ ...p, pace: v as Pace }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pace" />
                        </SelectTrigger>
                        <SelectContent>
                          {PACES.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select
                        value={seriesForm.format}
                        onValueChange={(v) =>
                          setSeriesForm((p) => ({ ...p, format: v as Format }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {FORMATS.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={generateEpisodeMutation.isPending}
                  >
                    {generateEpisodeMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Generate Episode
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Remix ────────────────────────────────── */}
        <TabsContent value="remix">
          <Card>
            <CardHeader>
              <CardTitle>Remix</CardTitle>
              <CardDescription>
                Pick a script and adapt it for a different platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allScripts && allScripts.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label>Source Script</Label>
                    <Select
                      value={remixForm.sourceScriptId}
                      onValueChange={(v) =>
                        setRemixForm((p) => ({ ...p, sourceScriptId: v ?? "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a script to remix" />
                      </SelectTrigger>
                      <SelectContent>
                        {allScripts.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.title} ({s.platform})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Platform</Label>
                    <Select
                      value={remixForm.targetPlatform}
                      onValueChange={(v) =>
                        setRemixForm((p) => ({
                          ...p,
                          targetPlatform: v as Platform,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    disabled={
                      !remixForm.sourceScriptId ||
                      !remixForm.targetPlatform ||
                      remixMutation.isPending
                    }
                    onClick={() => {
                      if (!remixForm.targetPlatform) return;
                      remixMutation.mutate({
                        sourceScriptId: remixForm.sourceScriptId,
                        targetPlatform: remixForm.targetPlatform,
                      });
                    }}
                  >
                    {remixMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Remix Script
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  Create a script first to use Remix.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
