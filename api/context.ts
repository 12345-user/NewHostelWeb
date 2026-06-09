import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { AppUser } from "./local-auth";
import { authenticateLocalRequest } from "./local-auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: AppUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  try {
    ctx.user = await authenticateLocalRequest(opts.req.headers);
  } catch {
    // Authentication is optional here
  }
  return ctx;
}
