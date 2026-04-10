"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Pencil,
  Volume2,
  Copy,
  Hash,
  Mic,
  Monitor,
  Trash2,
  Loader2,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";

export default function ScriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: script, isLoading } = useQuery(
    trpc.script.getById.queryOptions({ id })
  );

  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTextOnScreen, setEditTextOnScreen] = useState("");
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(1);

  const regenMutation = useMutation(
    trpc.script.regenerateScene.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.script.getById.queryKey({ id }),
        });
        toast.success("Scene regenerated!");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const editMutation = useMutation(
    trpc.script.editScene.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.script.getById.queryKey({ id }),
        });
        setEditingScene(null);
        toast.success("Scene updated!");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const captionMutation = useMutation(
    trpc.script.generateCaption.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.script.getById.queryKey({ id }),
        });
        toast.success("Caption generated!");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const { data: voiceover } = useQuery(
    trpc.script.getVoiceover.queryOptions({ scriptId: id })
  );

  const deleteMutation = useMutation(
    trpc.script.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Script deleted");
        router.push("/library");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  function speakScene(text: string) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="text-muted-foreground py-20 text-center">
        Script not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/library")}
            className="mb-2"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to Library
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{script.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{script.platform}</Badge>
            <Badge variant="outline">{script.mode.replace("_", " ")}</Badge>
            {script.pace && <Badge variant="outline">{script.pace}</Badge>}
            {script.format && (
              <Badge variant="outline">{script.format.replace("_", " ")}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={teleprompterOpen} onOpenChange={setTeleprompterOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              <Monitor className="mr-1 h-3.5 w-3.5" />
              Teleprompter
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Teleprompter</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 pb-2">
                {[1, 1.5, 2, 2.5].map((speed) => (
                  <Button
                    key={speed}
                    variant={
                      teleprompterSpeed === speed ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setTeleprompterSpeed(speed)}
                  >
                    x{speed}
                  </Button>
                ))}
              </div>
              <div
                className="max-h-[60vh] overflow-y-auto rounded-lg bg-black p-8 text-2xl leading-relaxed text-white"
                style={{
                  animation: `scroll ${60 / teleprompterSpeed}s linear`,
                }}
              >
                {script.scenes.map((scene) => (
                  <p key={scene.id} className="mb-6">
                    {scene.content}
                  </p>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(script.scenes.map((s) => s.content).join("\n\n"))
            }
          >
            <Copy className="mr-1 h-3.5 w-3.5" />
            Copy
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteMutation.mutate({ id })}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Scenes */}
      <div className="space-y-4">
        {script.scenes.map((scene) => (
          <Card key={scene.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs uppercase">{scene.type}</Badge>
                  <span className="text-muted-foreground text-xs">
                    Scene {scene.order}
                  </span>
                  {scene.isRegenerated && (
                    <Badge variant="outline" className="text-xs">
                      Regenerated
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => speakScene(scene.content)}
                    title="Read aloud"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => {
                      setEditingScene(scene.id);
                      setEditContent(scene.content);
                      setEditTextOnScreen(scene.textOnScreen ?? "");
                    }}
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {!scene.isRegenerated && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        regenMutation.mutate({
                          scriptId: id,
                          sceneId: scene.id,
                        })
                      }
                      disabled={regenMutation.isPending}
                      title="Regenerate (1x)"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingScene === scene.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                  />
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">
                      Text on Screen
                    </p>
                    <Textarea
                      value={editTextOnScreen}
                      onChange={(e) => setEditTextOnScreen(e.target.value)}
                      rows={2}
                      placeholder="Text shown on screen..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        editMutation.mutate({
                          scriptId: id,
                          sceneId: scene.id,
                          content: editContent,
                          textOnScreen: editTextOnScreen,
                        })
                      }
                      disabled={editMutation.isPending}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingScene(null)}
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{scene.content}</p>
                  {scene.textOnScreen && (
                    <div className="bg-muted mt-3 rounded p-2">
                      <p className="text-muted-foreground text-xs font-medium">
                        📺 Text on Screen
                      </p>
                      <p className="text-sm">{scene.textOnScreen}</p>
                    </div>
                  )}
                  {scene.originalContent && (
                    <details className="mt-2">
                      <summary className="text-muted-foreground cursor-pointer text-xs">
                        View original
                      </summary>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {scene.originalContent}
                      </p>
                    </details>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Caption */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Caption & Hashtags
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => captionMutation.mutate({ scriptId: id })}
              disabled={captionMutation.isPending}
            >
              {captionMutation.isPending ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
              )}
              {script.caption ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </CardHeader>
        {script.caption && (
          <CardContent className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Description
              </p>
              <p className="whitespace-pre-wrap">
                {script.caption.description}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Hashtags
              </p>
              <p className="text-sm">{script.caption.hashtags}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `${script.caption!.description}\n\n${script.caption!.hashtags}`
                )
              }
            >
              <Copy className="mr-1 h-3.5 w-3.5" />
              Copy Caption
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Voiceover */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Full Voiceover
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voiceover ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {voiceover.voiceover}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakScene(voiceover.voiceover)}
                >
                  <Volume2 className="mr-1 h-3.5 w-3.5" />
                  Read Aloud
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(voiceover.voiceover)}
                >
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
