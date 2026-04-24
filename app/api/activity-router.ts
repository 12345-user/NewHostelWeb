import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { activities } from "@db/schema";
import { eq } from "drizzle-orm";

export const activityRouter = createRouter({
  list: publicQuery.query(async () => {
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

  create: adminQuery
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
      const db = getDb();
      const result = await db.insert(activities).values({
        ...input,
        images: input.images ? JSON.stringify(input.images) : null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
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

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(activities).where(eq(activities.id, input.id));
      return { success: true };
    }),
});
