import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { people } from "@db/schema";
import { eq } from "drizzle-orm";

export const peopleRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const results = await db.select().from(people).orderBy(people.name);
    return results.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(people)
        .where(eq(people.id, input.id))
        .limit(1);
      if (results.length === 0) return null;
      const p = results[0];
      return {
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
      };
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        bio: z.string().optional(),
        skills: z.string().optional(),
        contact: z.string().optional(),
        avatar: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(people).values({
        ...input,
        images: input.images ? JSON.stringify(input.images) : null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        bio: z.string().optional(),
        skills: z.string().optional(),
        contact: z.string().optional(),
        avatar: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(people)
        .set({
          ...data,
          images: data.images ? JSON.stringify(data.images) : undefined,
        })
        .where(eq(people.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(people).where(eq(people.id, input.id));
      return { success: true };
    }),
});
