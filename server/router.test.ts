import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./router.js";
import type { AppUser } from "./local-auth.js";

function caller(user?: AppUser) {
  return appRouter.createCaller({
    req: new Request("http://localhost/api/trpc"),
    resHeaders: new Headers(),
    user,
  });
}

describe("appRouter", () => {
  it("responds to ping", async () => {
    const result = await caller().ping();

    expect(result.ok).toBe(true);
    expect(typeof result.ts).toBe("number");
  });

  it("logs in with an email account and human verification", async () => {
    const result = await caller().auth.login({
      username: "1205268345@qq.com",
      password: "awdxssklkl123",
      humanCode: "CATCAMEL",
    });

    expect(result).toMatchObject({
      username: "1205268345@qq.com",
      name: "客栈负责人",
      role: "owner",
    });
  });

  it("rejects login when human verification is missing", async () => {
    await expect(
      caller().auth.login({
        username: "1205268345@qq.com",
        password: "awdxssklkl123",
        humanCode: "wrong",
      }),
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("allows admins to create but not delete", async () => {
    const adminCaller = caller({
      id: 2,
      username: "wxw@catcamel.com",
      name: "WXW",
      role: "admin",
    });

    const created = await adminCaller.item.create({
      name: "测试物品",
      date: "2026-06-08",
      description: "权限测试",
      image: "",
    });

    expect(created.id).toBeGreaterThan(0);
    await expect(adminCaller.item.delete({ id: created.id })).rejects.toThrow();
  });

  it("allows the owner to delete", async () => {
    const ownerCaller = caller({
      id: 1,
      username: "1205268345@qq.com",
      name: "客栈负责人",
      role: "owner",
    });

    const created = await ownerCaller.item.create({
      name: "待删除测试物品",
      date: "2026-06-08",
      description: "负责人权限测试",
      image: "",
    });

    await expect(ownerCaller.item.delete({ id: created.id })).resolves.toEqual({
      success: true,
    });
  });
});
