import { Hono } from "hono";
import * as cookie from "cookie";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { env } from "./lib/env.js";
import { createOAuthCallbackHandler } from "./kimi/auth.js";
import { Paths, Session } from "../contracts/constants.js";
import { getSessionCookieOptions } from "./lib/cookies.js";
import { getDb } from "./queries/connection.js";
import {
  authenticateLocalRequest,
  signLocalSession,
  verifyCredentialHash,
  verifyCredentials,
} from "./local-auth.js";
import { activities, people } from "../db/schema.js";
import { demoActivities, demoPeople } from "./demo-data.js";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const app = new Hono<{ Bindings: HttpBindings }>();

app.get(Paths.oauthCallback, createOAuthCallbackHandler());

app.post("/api/auth/login", async (c) => {
  let input: {
    username?: string;
    password?: string;
    humanCode?: string;
  };

  try {
    input = await c.req.json();
  } catch {
    return c.json({ error: "请求格式不正确" }, 400);
  }

  const username = String(input.username || "").trim().toLowerCase();
  const password = String(input.password || "");
  const humanCode = String(input.humanCode || "");

  if (!username.includes("@") || !password) {
    return c.json({ error: "请输入邮箱账号和密码" }, 400);
  }

  if (humanCode && humanCode.trim().toLowerCase() !== "catcamel") {
    return c.json({ error: "真人验证不正确，请重新输入" }, 400);
  }

  const user = verifyCredentials(username, password);
  if (!user) {
    return c.json({ error: "账号或密码不正确" }, 401);
  }

  const token = await signLocalSession(user);
  const opts = getSessionCookieOptions(c.req.raw.headers);
  c.header(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );

  return c.json(user);
});

app.get("/api/auth/login", async (c) => {
  const username = String(c.req.query("username") || "").trim().toLowerCase();
  const passwordHash = String(c.req.query("passwordHash") || "");
  const humanCode = String(c.req.query("humanCode") || "");

  if (!username.includes("@") || !passwordHash) {
    return c.json({ error: "请输入邮箱账号和密码" }, 400);
  }

  if (humanCode && humanCode.trim().toLowerCase() !== "catcamel") {
    return c.json({ error: "真人验证不正确，请重新输入" }, 400);
  }

  const user = verifyCredentialHash(username, passwordHash);
  if (!user) {
    return c.json({ error: "账号或密码不正确" }, 401);
  }

  const token = await signLocalSession(user);
  const opts = getSessionCookieOptions(c.req.raw.headers);
  c.header("cache-control", "no-store");
  c.header(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: Session.maxAgeMs / 1000,
    }),
  );

  return c.json(user);
});

app.post("/api/auth/logout", async (c) => {
  const opts = getSessionCookieOptions(c.req.raw.headers);
  c.header(
    "set-cookie",
    cookie.serialize(Session.cookieName, "", {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: 0,
      expires: new Date(0),
    }),
  );

  return c.json({ success: true });
});

app.get("/api/auth/logout", async (c) => {
  const opts = getSessionCookieOptions(c.req.raw.headers);
  c.header("cache-control", "no-store");
  c.header(
    "set-cookie",
    cookie.serialize(Session.cookieName, "", {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge: 0,
      expires: new Date(0),
    }),
  );

  return c.json({ success: true });
});

async function requireEditor(headers: Headers) {
  const user = await authenticateLocalRequest(headers);
  if (!user || (user.role !== "owner" && user.role !== "admin")) return null;
  return user;
}

app.get("/api/admin/activity/save", async (c) => {
  const user = await requireEditor(c.req.raw.headers);
  if (!user) return c.json({ error: "请先登录后台" }, 401);

  const id = Number(c.req.query("id") || 0);
  const title = String(c.req.query("title") || "").trim();
  const date = String(c.req.query("date") || "").trim();
  const participants = String(c.req.query("participants") || "");
  const summary = String(c.req.query("summary") || "");
  const description = String(c.req.query("description") || "");

  if (!title || !date) return c.json({ error: "活动标题和日期不能为空" }, 400);

  if (!env.databaseUrl) {
    if (id > 0) {
      const activity = demoActivities.find((item) => item.id === id);
      if (!activity) return c.json({ error: "活动不存在" }, 404);
      Object.assign(activity, {
        title,
        date,
        participants,
        summary,
        description,
        updatedAt: new Date(),
      });
      return c.json({ success: true, id });
    }

    const nextId = Math.max(0, ...demoActivities.map((item) => item.id)) + 1;
    demoActivities.unshift({
      id: nextId,
      title,
      date,
      participants,
      summary,
      description,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return c.json({ success: true, id: nextId });
  }

  const db = getDb();
  if (id > 0) {
    await db
      .update(activities)
      .set({ title, date, participants, summary, description })
      .where(eq(activities.id, id));
    return c.json({ success: true, id });
  }

  const result = await db
    .insert(activities)
    .values({ title, date, participants, summary, description, images: null });
  return c.json({ success: true, id: Number(result[0].insertId) });
});

app.get("/api/admin/person/save", async (c) => {
  const user = await requireEditor(c.req.raw.headers);
  if (!user) return c.json({ error: "请先登录后台" }, 401);

  const id = Number(c.req.query("id") || 0);
  const name = String(c.req.query("name") || "").trim();
  const bio = String(c.req.query("bio") || "");
  const skills = String(c.req.query("skills") || "");
  const contact = String(c.req.query("contact") || "");

  if (!name) return c.json({ error: "人员姓名不能为空" }, 400);

  if (!env.databaseUrl) {
    if (id > 0) {
      const person = demoPeople.find((item) => item.id === id);
      if (!person) return c.json({ error: "人员不存在" }, 404);
      Object.assign(person, {
        name,
        bio,
        skills,
        contact,
        updatedAt: new Date(),
      });
      return c.json({ success: true, id });
    }

    const nextId = Math.max(0, ...demoPeople.map((item) => item.id)) + 1;
    demoPeople.unshift({
      id: nextId,
      name,
      bio,
      skills,
      contact,
      avatar: "",
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return c.json({ success: true, id: nextId });
  }

  const db = getDb();
  if (id > 0) {
    await db.update(people).set({ name, bio, skills, contact }).where(eq(people.id, id));
    return c.json({ success: true, id });
  }

  const result = await db
    .insert(people)
    .values({ name, bio, skills, contact, avatar: null, images: null });
  return c.json({ success: true, id: Number(result[0].insertId) });
});

// Serve static files from public directory
app.use("/images/*", async (c) => {
  const filePath = path.join(process.cwd(), c.req.path);
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath);
      const contentType = getContentType(filePath);
      return c.body(content, 200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      });
    }
  } catch {
    // File doesn't exist
  }
  return c.notFound();
});

app.use("/uploads/*", async (c) => {
  const filePath = path.join(process.cwd(), c.req.path);
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath);
      const contentType = getContentType(filePath);
      return c.body(content, 200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      });
    }
  } catch {
    // File doesn't exist
  }
  return c.notFound();
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

function getContentType(filePath: string): string {
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".gif")) return "image/gif";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

export default app;

if (env.isProduction && !process.env.VERCEL) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite.js");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
