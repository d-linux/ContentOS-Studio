"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, MessageSquare, Mail, Gift, Loader2 } from "lucide-react";

const FAQ = [
  {
    q: "How does ContentOS Studio generate scripts?",
    a: "ContentOS uses AI (Claude by Anthropic) combined with your Brand Brain context to generate scripts that sound like you. Every script is tailored to your tone, niche, and boundaries.",
  },
  {
    q: "What is Brand Brain?",
    a: "Brand Brain is your creator profile — it stores your name, tone, niche, about section, and boundaries. The AI uses this to write in your voice. The more detail you provide, the better the scripts.",
  },
  {
    q: "How many scripts can I generate?",
    a: "Free plan: 5 scripts/month. Paid plan: 50 scripts/month. You can also buy extra credits (5 for £2.99) or earn free scripts through referrals and feedback.",
  },
  {
    q: "What is scene regeneration?",
    a: "Each scene in a script can be regenerated once. This gives you an alternative take while keeping it consistent with the rest of the script. The original is saved so you can compare.",
  },
  {
    q: "How does the YouTube Analyzer work?",
    a: "Paste the URL of a YouTube video you made from one of your scripts. We fetch its performance data (views, likes, comments) and feed insights back to your Brand Brain, so future scripts learn from what worked.",
  },
  {
    q: "What are Series and connection modes?",
    a: "Series let you create connected episodes. Connection modes control how episodes relate: Sequential (linear story), Anthology (same theme, standalone), Running Format (same structure), Journey (progress tracking), Response (audience replies).",
  },
];

export default function HelpPage() {
  const trpc = useTRPC();
  const [feedbackContent, setFeedbackContent] = useState("");

  const feedbackMutation = useMutation(
    trpc.feedback.submit.mutationOptions({
      onSuccess: () => {
        toast.success("Feedback submitted! You earned 1 free script credit.");
        setFeedbackContent("");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="text-primary h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help</h1>
          <p className="text-muted-foreground">FAQ, support, and feedback.</p>
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {FAQ.map((item, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="text-muted-foreground mt-2 text-sm">{item.a}</p>
            </details>
          ))}
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Support
          </CardTitle>
          <CardDescription>Need help? Reach out to our team.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Email us at{" "}
            <a
              href="mailto:support@contentosstudio.com"
              className="text-foreground font-medium underline underline-offset-4"
            >
              support@contentosstudio.com
            </a>
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Leave Feedback
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Gift className="h-3.5 w-3.5" />
            Earn 1 free script generation for your feedback!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              feedbackMutation.mutate({ content: feedbackContent });
            }}
          >
            <div className="space-y-2">
              <Label>Your Feedback</Label>
              <Textarea
                placeholder="Tell us what you think — what's working, what could be better, feature ideas..."
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                rows={4}
                minLength={10}
                required
              />
            </div>
            <Button type="submit" disabled={feedbackMutation.isPending}>
              {feedbackMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
