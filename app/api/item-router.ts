import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { items } from "@db/schema";
import { eq } from "drizzle-orm";

export const itemRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(items).orderBy(items.createdAt);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(items)
        .where(eq(items.id, input.id))
        .limit(1);
      return results.length > 0 ? results[0] : null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        date: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(items).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        date: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(items).set(data).where(eq(items.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(items).where(eq(items.id, input.id));
      return { success: true };
    }),
});
