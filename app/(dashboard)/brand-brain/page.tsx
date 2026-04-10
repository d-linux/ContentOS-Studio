"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Brain, Save } from "lucide-react";

export default function BrandBrainPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: brandBrain, isLoading } = useQuery(
    trpc.brandBrain.get.queryOptions()
  );

  const [form, setForm] = useState({
    name: "",
    tone: "",
    niche: "",
    about: "",
    boundaries: "",
  });

  const [initialized, setInitialized] = useState(false);

  // Populate form when data loads
  if (brandBrain && !initialized) {
    setForm({
      name: brandBrain.name ?? "",
      tone: brandBrain.tone ?? "",
      niche: brandBrain.niche ?? "",
      about: brandBrain.about ?? "",
      boundaries: brandBrain.boundaries ?? "",
    });
    setInitialized(true);
  }

  const upsertMutation = useMutation(
    trpc.brandBrain.upsert.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.brandBrain.get.queryKey(),
        });
        toast.success("Brand Brain saved!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    upsertMutation.mutate({
      name: form.name || undefined,
      tone: form.tone || undefined,
      niche: form.niche || undefined,
      about: form.about || undefined,
      boundaries: form.boundaries || undefined,
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Brain</h1>
          <p className="text-muted-foreground">
            Teach the AI your voice, style, and boundaries. This context shapes
            every script it generates for you.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>
              Who are you? Help the AI sound like you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Creator Name</Label>
              <Input
                id="name"
                placeholder="Your name or channel name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone / Voice</Label>
              <Input
                id="tone"
                placeholder="e.g. casual, hype, sarcastic, educational, chill"
                value={form.tone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tone: e.target.value }))
                }
                maxLength={500}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="e.g. tech reviews, fitness, cooking, finance"
                value={form.niche}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, niche: e.target.value }))
                }
                maxLength={500}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Context</CardTitle>
            <CardDescription>
              The more you share, the better the AI writes for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about">About You</Label>
              <Textarea
                id="about"
                placeholder="Anything about yourself, your content plan, ideas, inspirations, what makes you unique..."
                value={form.about}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, about: e.target.value }))
                }
                maxLength={2000}
                rows={5}
              />
              <p className="text-muted-foreground text-xs">
                {form.about.length}/2000
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="boundaries">Boundaries</Label>
              <Textarea
                id="boundaries"
                placeholder="What should the AI never do or mention? e.g. no profanity, don't mention competitors, avoid politics..."
                value={form.boundaries}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    boundaries: e.target.value,
                  }))
                }
                maxLength={1000}
                rows={3}
              />
              <p className="text-muted-foreground text-xs">
                {form.boundaries.length}/1000
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={upsertMutation.isPending}
        >
          <Save className="mr-2 h-4 w-4" />
          {upsertMutation.isPending ? "Saving..." : "Save Brand Brain"}
        </Button>
      </form>
    </div>
  );
}
