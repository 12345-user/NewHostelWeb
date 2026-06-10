import { authRouter } from "./auth-router.js";
import { activityRouter } from "./activity-router.js";
import { peopleRouter } from "./people-router.js";
import { itemRouter } from "./item-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  activity: activityRouter,
  people: peopleRouter,
  item: itemRouter,
});

export type AppRouter = typeof appRouter;
