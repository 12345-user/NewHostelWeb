import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc-client";
import { Compass, Lock, UserRound } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate("/admin");
    },
    onError: () => {
      setErrorMessage("账号或密码不正确，请检查后重试。");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-[#EBE5DB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black mb-4 bg-white/60">
            <Compass className="w-8 h-8 text-[#C52A32]" />
          </div>
          <h1 className="font-heading text-3xl mb-2">猫驼旅者客栈</h1>
          <p className="font-body text-sm opacity-60">内容管理登录</p>
        </div>

        <Card className="border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
          <CardHeader className="text-center border-b-2 border-black/10">
            <CardTitle className="font-heading text-xl">后台账号登录</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="font-ui text-sm mb-1 block">账号</span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 opacity-50" />
                  <Input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="pl-9 border-2 border-black rounded-none bg-[#F8F4EC]"
                    autoComplete="username"
                    placeholder="请输入账号"
                  />
                </div>
              </label>

              <label className="block">
                <span className="font-ui text-sm mb-1 block">密码</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 opacity-50" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-9 border-2 border-black rounded-none bg-[#F8F4EC]"
                    autoComplete="current-password"
                    placeholder="请输入密码"
                  />
                </div>
              </label>

              {errorMessage && (
                <p className="border border-[#C52A32] bg-[#C52A32]/10 px-3 py-2 font-body text-sm text-[#8C1F25]">
                  {errorMessage}
                </p>
              )}

              <Button
                className="w-full bg-black text-white hover:bg-[#C52A32] border-2 border-black rounded-none font-ui text-sm tracking-wider transition-all duration-300"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "登录中..." : "登录后台"}
              </Button>
            </form>

            <div className="mt-5 border-t border-black/10 pt-4 font-body text-xs leading-relaxed opacity-55">
              负责人可新增、编辑、删除全部内容；管理员只能新增和编辑内容；未登录用户只能浏览展示页面。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
