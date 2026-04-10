import { Redis } from "@upstash/redis";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL = 3600; // 1 hour

const redis = Redis.fromEnv();

interface TrendTopic {
  title: string;
  description: string;
  sourceVideoId: string;
  sourceChannelTitle: string;
  viewCount: string;
  thumbnailUrl: string;
}

async function youtubeGet<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not configured");

  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  url.searchParams.set("key", apiKey);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${errorBody}`);
  }

  return res.json() as Promise<T>;
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId?: string };
    snippet: {
      title: string;
      channelTitle: string;
      description: string;
      publishedAt: string;
      thumbnails: { medium?: { url: string } };
    };
  }>;
}

interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      description: string;
      publishedAt: string;
      thumbnails: { medium?: { url: string } };
    };
    statistics: { viewCount: string };
  }>;
}

export async function getTrendingVideos(
  niche: string,
  regionCode = "US",
  maxResults = 10
): Promise<TrendTopic[]> {
  const cacheKey = `trends:${niche}:${regionCode}`;
  const cached = await redis.get<TrendTopic[]>(cacheKey);
  if (cached) return cached;

  // Search for recent popular videos in the user's niche
  const searchData = await youtubeGet<YouTubeSearchResponse>("search", {
    part: "snippet",
    q: niche,
    type: "video",
    order: "viewCount",
    publishedAfter: getDateDaysAgo(7),
    regionCode,
    maxResults: String(maxResults),
  });

  const videoIds = searchData.items
    .map((item) => item.id.videoId)
    .filter(Boolean)
    .join(",");

  if (!videoIds) return [];

  // Get statistics for the videos
  const videoData = await youtubeGet<YouTubeVideoResponse>("videos", {
    part: "snippet,statistics",
    id: videoIds,
  });

  const topics: TrendTopic[] = videoData.items.map((video) => ({
    title: video.snippet.title,
    description: video.snippet.description.substring(0, 300),
    sourceVideoId: video.id,
    sourceChannelTitle: video.snippet.channelTitle,
    viewCount: video.statistics.viewCount,
    thumbnailUrl: video.snippet.thumbnails.medium?.url ?? "",
  }));

  // Cache for 1 hour
  await redis.set(cacheKey, topics, { ex: CACHE_TTL });

  return topics;
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
