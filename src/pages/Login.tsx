import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc-client";
import { Compass, Lock, Mail, ShieldCheck } from "lucide-react";

const HUMAN_CODE = "CATCAMEL";

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [humanCode, setHumanCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!submittedAt || !isPending) return;

    const timer = window.setTimeout(() => {
      if (isPending) {
        setIsPending(false);
        setSubmittedAt(null);
        setErrorMessage("登录请求超时，请刷新页面后重试。");
      }
    }, 15000);

    return () => window.clearTimeout(timer);
  }, [isPending, submittedAt]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.includes("@")) {
      setErrorMessage("请输入邮箱格式的账号。");
      return;
    }

    if (humanCode.trim().toUpperCase() !== HUMAN_CODE) {
      setErrorMessage("真人验证不正确，请输入 CATCAMEL。");
      return;
    }

    setSubmittedAt(Date.now());
    setIsPending(true);

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    try {
      const passwordHash = await sha256Hex(password);
      const params = new URLSearchParams({
        username: email.trim().toLowerCase(),
        passwordHash,
        humanCode,
        t: String(Date.now()),
      });

      const response = await fetch(`/api/auth/login?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setErrorMessage(data?.error || "登录失败，请检查邮箱账号、密码和真人验证。");
        return;
      }

      await utils.invalidate();
      navigate("/admin");
    } catch {
      setErrorMessage("登录请求失败，请检查网络后重试。");
    } finally {
      window.clearTimeout(timer);
      setIsPending(false);
      setSubmittedAt(null);
    }
  };

  const isSubmitting = isPending && submittedAt !== null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EBE5DB] px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center sm:mb-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border-2 border-black bg-white/60">
            <Compass className="h-8 w-8 text-[#C52A32]" />
          </div>
          <h1 className="mb-2 font-heading text-3xl">猫驼旅者客栈</h1>
          <p className="font-body text-sm text-black/60">内容管理登录</p>
        </div>

        <Card className="rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
          <CardHeader className="border-b-2 border-black/10 text-center">
            <CardTitle className="font-heading text-xl">后台账号登录</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block font-ui text-sm">邮箱账号</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-12 rounded-none border-2 border-black bg-[#F8F4EC] pl-9"
                    autoComplete="username"
                    placeholder="请输入邮箱账号"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block font-ui text-sm">密码</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="min-h-12 rounded-none border-2 border-black bg-[#F8F4EC] pl-9"
                    autoComplete="current-password"
                    placeholder="请输入密码"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block font-ui text-sm">真人验证</span>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                    <Input
                      value={humanCode}
                      onChange={(event) => setHumanCode(event.target.value)}
                      className="min-h-12 rounded-none border-2 border-black bg-[#F8F4EC] pl-9 uppercase"
                      autoComplete="off"
                      placeholder="输入右侧字符"
                      required
                    />
                  </div>
                  <div className="flex min-h-12 items-center border-2 border-black bg-[#F3C84B] px-3 font-ui text-sm font-bold tracking-[0.18em]">
                    {HUMAN_CODE}
                  </div>
                </div>
              </label>

              {errorMessage && (
                <p className="border border-[#C52A32] bg-[#C52A32]/10 px-3 py-2 font-body text-sm text-[#8C1F25]">
                  {errorMessage}
                </p>
              )}

              <Button
                className="min-h-12 w-full rounded-none border-2 border-black bg-black font-ui text-sm tracking-wider text-white transition-all duration-300 hover:bg-[#C52A32] disabled:bg-black/50"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "登录中..." : "登录后台"}
              </Button>
            </form>

            <div className="mt-5 border-t border-black/10 pt-4 font-body text-xs leading-relaxed text-black/55">
              负责人可新增、编辑、删除全部内容；操作员只能新增和编辑内容；未登录用户只能浏览展示页面。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
