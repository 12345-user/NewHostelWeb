import { authRouter } from "./auth-router";
import { activityRouter } from "./activity-router";
import { peopleRouter } from "./people-router";
import { itemRouter } from "./item-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  activity: activityRouter,
  people: peopleRouter,
  item: itemRouter,
});

export type AppRouter = typeof appRouter;
