import "server-only";
import { headers } from "next/headers";
import { createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";
import { createCallerFactory } from "./init";

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(async () =>
  createTRPCContext({ headers: await headers() })
);
