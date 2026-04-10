"use client";

import { useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Library, Layers, BarChart3, Loader2 } from "lucide-react";

export default function LibraryPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: scripts, isLoading: scriptsLoading } = useQuery(
    trpc.script.list.queryOptions()
  );

  const { data: seriesList } = useQuery(trpc.series.list.queryOptions());

  // YouTube Analyzer
  const [analyzerScriptId, setAnalyzerScriptId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const analyzeMutation = useMutation(
    trpc.youtubeAnalyzer.analyze.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success("Video analyzed! Insights saved to Brand Brain.");
        setAnalyzerScriptId(null);
        setVideoUrl("");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  if (scriptsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Library className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground">
            All your scripts and series in one place.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({scripts?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="series">
            <Layers className="mr-1 h-3.5 w-3.5" />
            Series ({seriesList?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {scripts && scripts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {scripts.map((script) => (
                <Link key={script.id} href={`/script/${script.id}`}>
                  <Card className="hover:bg-muted/50 h-full transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-1 text-base">
                          {script.title}
                        </CardTitle>
                        {script.platform === "youtube" && (
                          <Dialog
                            open={analyzerScriptId === script.id}
                            onOpenChange={(open) => {
                              if (open) setAnalyzerScriptId(script.id);
                              else {
                                setAnalyzerScriptId(null);
                                setVideoUrl("");
                              }
                            }}
                          >
                            <DialogTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={(e) => e.preventDefault()}
                                  title="Analyze YouTube video"
                                />
                              }
                            >
                              <BarChart3 className="h-3.5 w-3.5" />
                            </DialogTrigger>
                            <DialogContent onClick={(e) => e.stopPropagation()}>
                              <DialogHeader>
                                <DialogTitle>YouTube Analyzer</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Video URL</Label>
                                  <Input
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) =>
                                      setVideoUrl(e.target.value)
                                    }
                                  />
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={() => {
                                    if (!analyzerScriptId || !videoUrl) return;
                                    analyzeMutation.mutate({
                                      scriptId: analyzerScriptId,
                                      videoUrl,
                                    });
                                  }}
                                  disabled={
                                    analyzeMutation.isPending || !videoUrl
                                  }
                                >
                                  {analyzeMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Analyze Video
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {script.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {script.mode.replace("_", " ")}
                        </Badge>
                        {script.episodeNumber && (
                          <Badge variant="outline" className="text-xs">
                            Part {script.episodeNumber}
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {script.topicDescription && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {script.topicDescription}
                        </p>
                      )}
                      <p className="text-muted-foreground mt-2 text-xs">
                        {new Date(script.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-20 text-center">
              <p>No scripts yet.</p>
              <Link href="/create">
                <Button className="mt-4">Create your first script</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="series" className="mt-4">
          {seriesList && seriesList.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {seriesList.map((s) => (
                <Card key={s.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {s.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {s.connectionMode.replace("_", " ")}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  {s.description && (
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {s.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-20 text-center">
              <p>No series yet.</p>
              <Link href="/create">
                <Button className="mt-4">Create a series</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
