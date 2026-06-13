import { Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router';

const footerLinks = [
  { label: '活动记录', to: '/activities' },
  { label: '人员介绍', to: '/people' },
  { label: '物品展示', to: '/items' },
  { label: '关于我们', to: '/about' },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#EBE5DB]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr]">
          <div className="max-w-md">
            <h3 className="font-heading text-2xl leading-tight">猫驼旅者客栈</h3>
            <p className="mt-3 font-body text-sm leading-7 text-black/70">
              一间为旅人、朋友和故事留灯的客栈。慢下来，住几天，把路上的温度留在这里。
            </p>
          </div>

          <div>
            <h4 className="font-ui text-sm font-semibold tracking-wider">联系信息</h4>
            <div className="mt-3 space-y-2 font-body text-sm leading-6 text-black/70">
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#B56A4F]" />
                <span>云南省大理市古城内</span>
              </p>
              <p className="break-all">hello@catcamel.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-ui text-sm font-semibold tracking-wider">快速导航</h4>
            <nav className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:block sm:space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block min-h-8 font-body text-sm text-black/70 transition-colors hover:text-[#C52A32]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-black/20 pt-6 font-ui text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <p>猫驼旅者客栈 2026 All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-[#C52A32]" /> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
