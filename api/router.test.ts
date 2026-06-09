import { describe, expect, it } from "vitest";
import { appRouter } from "./router";
import type { AppUser } from "./local-auth";

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

  it("allows admins to create but not delete", async () => {
    const adminCaller = caller({
      id: 2,
      username: "admin1",
      name: "内容管理员一",
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
      username: "owner",
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
