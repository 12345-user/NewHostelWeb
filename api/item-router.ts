import { z } from "zod";
import { createRouter, publicQuery, editorQuery, ownerQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { items } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { env } from "./lib/env.js";
import { demoItems } from "./demo-data.js";

export const itemRouter = createRouter({
  list: publicQuery.query(async () => {
    if (!env.databaseUrl) return demoItems;

    const db = getDb();
    return db.select().from(items).orderBy(items.createdAt);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      if (!env.databaseUrl) {
        return demoItems.find((item) => item.id === input.id) ?? null;
      }

      const db = getDb();
      const results = await db
        .select()
        .from(items)
        .where(eq(items.id, input.id))
        .limit(1);
      return results.length > 0 ? results[0] : null;
    }),

  create: editorQuery
    .input(
      z.object({
        name: z.string().min(1),
        date: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!env.databaseUrl) {
        const id = Math.max(0, ...demoItems.map((item) => item.id)) + 1;
        demoItems.unshift({
          id,
          name: input.name,
          date: input.date ?? "",
          description: input.description ?? "",
          image: input.image ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { id };
      }

      const db = getDb();
      const result = await db.insert(items).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: editorQuery
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
      if (!env.databaseUrl) {
        const item = demoItems.find((entry) => entry.id === input.id);
        if (item) {
          Object.assign(item, {
            ...input,
            updatedAt: new Date(),
          });
        }
        return { success: true };
      }

      const db = getDb();
      const { id, ...data } = input;
      await db.update(items).set(data).where(eq(items.id, id));
      return { success: true };
    }),

  delete: ownerQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      if (!env.databaseUrl) {
        const index = demoItems.findIndex((item) => item.id === input.id);
        if (index >= 0) demoItems.splice(index, 1);
        return { success: true };
      }

      const db = getDb();
      await db.delete(items).where(eq(items.id, input.id));
      return { success: true };
    }),
});
