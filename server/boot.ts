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
import {
  signLocalSession,
  verifyCredentialHash,
  verifyCredentials,
} from "./local-auth.js";
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
