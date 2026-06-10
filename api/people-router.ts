import { z } from "zod";
import { createRouter, publicQuery, editorQuery, ownerQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { people } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { env } from "./lib/env.js";
import { demoPeople } from "./demo-data.js";

export const peopleRouter = createRouter({
  list: publicQuery.query(async () => {
    if (!env.databaseUrl) return demoPeople;

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
      if (!env.databaseUrl) {
        return demoPeople.find((person) => person.id === input.id) ?? null;
      }

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

  create: editorQuery
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
      if (!env.databaseUrl) {
        const id = Math.max(0, ...demoPeople.map((item) => item.id)) + 1;
        demoPeople.unshift({
          id,
          name: input.name,
          bio: input.bio ?? "",
          skills: input.skills ?? "",
          contact: input.contact ?? "",
          avatar: input.avatar ?? "",
          images: input.images ?? [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { id };
      }

      const db = getDb();
      const result = await db.insert(people).values({
        ...input,
        images: input.images ? JSON.stringify(input.images) : null,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: editorQuery
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
      if (!env.databaseUrl) {
        const person = demoPeople.find((item) => item.id === input.id);
        if (person) {
          Object.assign(person, {
            ...input,
            images: input.images ?? person.images,
            updatedAt: new Date(),
          });
        }
        return { success: true };
      }

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

  delete: ownerQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      if (!env.databaseUrl) {
        const index = demoPeople.findIndex((item) => item.id === input.id);
        if (index >= 0) demoPeople.splice(index, 1);
        return { success: true };
      }

      const db = getDb();
      await db.delete(people).where(eq(people.id, input.id));
      return { success: true };
    }),
});
