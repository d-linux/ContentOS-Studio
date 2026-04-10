import { router } from "../init";

export const appRouter = router({
  // Routers will be added here as features are built
  // e.g. brandBrain: brandBrainRouter,
  // e.g. script: scriptRouter,
});

export type AppRouter = typeof appRouter;
