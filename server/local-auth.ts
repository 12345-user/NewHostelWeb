import * as cookie from "cookie";
import * as jose from "jose";
import { Session } from "../contracts/constants.js";
import { env } from "./lib/env.js";

export type AppRole = "owner" | "admin";

export type AppUser = {
  id: number;
  username: string;
  name: string;
  role: AppRole;
};

type Account = AppUser & {
  password: string;
};

const accounts: Account[] = [
  {
    id: 1,
    username: "1205268345@qq.com",
    password: "awdxssklkl123",
    name: "客栈负责人",
    role: "owner",
  },
  {
    id: 2,
    username: "wxw@catcamel.com",
    password: "109901aa109901",
    name: "WXW",
    role: "admin",
  },
  {
    id: 3,
    username: "lyh@catcamel.com",
    password: "109901aa109901",
    name: "LYH",
    role: "admin",
  },
  {
    id: 4,
    username: "hyf@catcamel.com",
    password: "109901aa109901",
    name: "HYF",
    role: "admin",
  },
];

const JWT_ALG = "HS256";

function getAuthSecret() {
  return new TextEncoder().encode(
    env.appSecret || "new-hostel-web-local-session-secret",
  );
}

function toPublicUser(account: Account): AppUser {
  return {
    id: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
  };
}

export function verifyCredentials(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase();
  const account = accounts.find(
    (item) =>
      item.username === normalizedUsername && item.password === password,
  );
  return account ? toPublicUser(account) : null;
}

export async function signLocalSession(user: AppUser) {
  return new jose.SignJWT({
    sub: user.username,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("7 days")
    .sign(getAuthSecret());
}

export async function authenticateLocalRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) return undefined;

  const { payload } = await jose.jwtVerify(token, getAuthSecret(), {
    algorithms: [JWT_ALG],
  });

  const username = String(payload.sub || "");
  const account = accounts.find((item) => item.username === username);
  return account ? toPublicUser(account) : undefined;
}

export const defaultAccounts = accounts.map(toPublicUser);
