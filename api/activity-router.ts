import { z } from "zod";
import { createRouter, publicQuery, editorQuery, ownerQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { activities } from "@db/schema";
import { eq } from "drizzle-orm";
import { env } from "./lib/env";
import { demoActivities } from "./demo-data";

export const activityRouter = createRouter({
  list: publicQuery.query(async () => {
    if (!env.databaseUrl) return demoActivities;

    const db = getDb();
    const results = await db.select().from(activities).orderBy(activities.date);
    return results.map((a) => ({
      ...a,
      images: a.images ? JSON.parse(a.images) : [],
    }));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      if (!env.databaseUrl) {
        return demoActivities.find((activity) => activity.id === input.id) ?? null;
      }

      const db = getDb();
      const results = await db
        .select()
        .from(activities)
        .where(eq(activities.id, input.id))
        .limit(1);
      if (results.length === 0) return null;
      const a = results[0];
      return {
        ...a,
        images: a.images ? JSON.parse(a.images) : [],
      };
    }),

  create: editorQuery
    .input(
      z.object({
        title: z.string().min(1),
        date: z.string().min(1),
        participants: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!env.databaseUrl) {
        const id = Math.max(0, ...demoActivities.map((item) => item.id)) + 1;
        demoActivities.unshift({
          id,
          title: input.title,
          date: input.date,
          participants: input.participants ?? "",
          summary: input.summary ?? "",
          description: input.description ?? "",
          images: input.images ?? [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { id };
      }

      const db = getDb();
      const result = await db.insert(activities).values({
        ...input,
        images: input.images ? JSON.stringify(input.images) : null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: editorQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        date: z.string().min(1).optional(),
        participants: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!env.databaseUrl) {
        const activity = demoActivities.find((item) => item.id === input.id);
        if (activity) {
          Object.assign(activity, {
            ...input,
            images: input.images ?? activity.images,
            updatedAt: new Date(),
          });
        }
        return { success: true };
      }

      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(activities)
        .set({
          ...data,
          images: data.images ? JSON.stringify(data.images) : undefined,
        })
        .where(eq(activities.id, id));
      return { success: true };
    }),

  delete: ownerQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      if (!env.databaseUrl) {
        const index = demoActivities.findIndex((item) => item.id === input.id);
        if (index >= 0) demoActivities.splice(index, 1);
        return { success: true };
      }

      const db = getDb();
      await db.delete(activities).where(eq(activities.id, input.id));
      return { success: true };
    }),
});
