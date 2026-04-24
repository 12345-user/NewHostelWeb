import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen bg-[#EBE5DB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black mb-4">
            <Compass className="w-8 h-8 text-[#C52A32]" />
          </div>
          <h1 className="font-heading text-3xl mb-2">猫驼旅者客栈</h1>
          <p className="font-body text-sm opacity-60">管理员登录</p>
        </div>

        <Card className="border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
          <CardHeader className="text-center border-b-2 border-black/10">
            <CardTitle className="font-heading text-xl">欢迎回来</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="font-body text-sm opacity-60 text-center mb-6">
              请使用 Kimi 账号登录以管理客栈内容
            </p>
            <Button
              className="w-full bg-black text-white hover:bg-[#C52A32] border-2 border-black rounded-none font-ui text-sm tracking-wider transition-all duration-300"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              使用 Kimi 账号登录
            </Button>
            <p className="font-body text-xs opacity-40 text-center mt-4">
              登录后即视为管理员身份
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
