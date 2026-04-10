import { router } from "../init";
import { brandBrainRouter } from "./brand-brain";
import { scriptRouter } from "./script";
import { seriesRouter } from "./series";
import { trendsRouter } from "./trends";
import { remixRouter } from "./remix";
import { billingRouter } from "./billing";
import { youtubeAnalyzerRouter } from "./youtube-analyzer";
import { feedbackRouter } from "./feedback";

export const appRouter = router({
  brandBrain: brandBrainRouter,
  script: scriptRouter,
  series: seriesRouter,
  trends: trendsRouter,
  remix: remixRouter,
  billing: billingRouter,
  youtubeAnalyzer: youtubeAnalyzerRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
