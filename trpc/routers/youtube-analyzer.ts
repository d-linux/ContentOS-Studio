import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../init";
import { scripts, youtubeAnalyses, brandBrains } from "@/db/schema";

export const youtubeAnalyzerRouter = router({
  // ─── Analyze a YouTube video's performance ────────────
  analyze: protectedProcedure
    .input(
      z.object({
        scriptId: z.string().uuid(),
        videoUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify script ownership and it's a YouTube script
      const [script] = await ctx.db
        .select()
        .from(scripts)
        .where(
          and(eq(scripts.id, input.scriptId), eq(scripts.userId, ctx.user.id))
        )
        .limit(1);

      if (!script) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Script not found",
        });
      }

      if (script.platform !== "youtube") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "YouTube analyzer is only available for YouTube scripts.",
        });
      }

      // Extract video ID from URL
      const videoId = extractYouTubeVideoId(input.videoUrl);
      if (!videoId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid YouTube URL.",
        });
      }

      // Fetch video statistics from YouTube API
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "YouTube API is not configured.",
        });
      }

      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("key", apiKey);
      url.searchParams.set("id", videoId);
      url.searchParams.set("part", "statistics,snippet");

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch video data from YouTube.",
        });
      }

      const data = (await res.json()) as {
        items: Array<{
          snippet: { title: string; publishedAt: string };
          statistics: {
            viewCount: string;
            likeCount: string;
            commentCount: string;
          };
        }>;
      };

      if (!data.items || data.items.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found on YouTube.",
        });
      }

      const video = data.items[0];
      const performanceData = {
        videoId,
        title: video.snippet.title,
        publishedAt: video.snippet.publishedAt,
        viewCount: Number(video.statistics.viewCount),
        likeCount: Number(video.statistics.likeCount),
        commentCount: Number(video.statistics.commentCount),
      };

      const insights = generateInsights(performanceData);

      // Save analysis
      const [analysis] = await ctx.db
        .insert(youtubeAnalyses)
        .values({
          scriptId: input.scriptId,
          userId: ctx.user.id,
          videoUrl: input.videoUrl,
          performanceData,
          insights,
        })
        .returning();

      // Feed insights back to Brand Brain's YouTube data
      const [brandBrain] = await ctx.db
        .select()
        .from(brandBrains)
        .where(eq(brandBrains.userId, ctx.user.id))
        .limit(1);

      if (brandBrain) {
        const existingData = (brandBrain.youtubeData as Array<unknown>) ?? [];
        const updatedData = [
          ...((Array.isArray(existingData)
            ? existingData
            : []) as Array<unknown>),
          {
            analyzedAt: new Date().toISOString(),
            ...performanceData,
            insights,
          },
        ];

        await ctx.db
          .update(brandBrains)
          .set({ youtubeData: updatedData, updatedAt: new Date() })
          .where(eq(brandBrains.userId, ctx.user.id));
      }

      return analysis;
    }),
});

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function generateInsights(data: {
  viewCount: number;
  likeCount: number;
  commentCount: number;
}): string {
  const engagementRate =
    data.viewCount > 0
      ? (((data.likeCount + data.commentCount) / data.viewCount) * 100).toFixed(
          2
        )
      : "0";

  const likeRatio =
    data.viewCount > 0
      ? ((data.likeCount / data.viewCount) * 100).toFixed(2)
      : "0";

  const parts = [
    `Views: ${data.viewCount.toLocaleString()}`,
    `Likes: ${data.likeCount.toLocaleString()}`,
    `Comments: ${data.commentCount.toLocaleString()}`,
    `Engagement rate: ${engagementRate}%`,
    `Like ratio: ${likeRatio}%`,
  ];

  if (Number(engagementRate) > 5) {
    parts.push(
      "Strong engagement — audience is actively interacting. Double down on this content style."
    );
  } else if (Number(engagementRate) > 2) {
    parts.push(
      "Decent engagement. Consider stronger hooks and CTAs to drive more comments."
    );
  } else {
    parts.push(
      "Low engagement relative to views. Try more polarizing hooks, direct questions, or controversial takes to spark interaction."
    );
  }

  return parts.join("\n");
}
