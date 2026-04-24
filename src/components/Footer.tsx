import { Heart, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#EBE5DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl mb-3">猫驼旅者客栈</h3>
            <p className="font-body text-sm leading-relaxed opacity-70">
              一个属于旅人的温暖驿站，在这里遇见故事，也遇见自己。
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-ui text-sm font-semibold tracking-wider uppercase mb-3">
              联系方式
            </h4>
            <div className="space-y-2 font-body text-sm opacity-70">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                云南省大理市古城内
              </p>
              <p>hello@catcamel.com</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-ui text-sm font-semibold tracking-wider uppercase mb-3">
              快速导航
            </h4>
            <div className="space-y-2 font-body text-sm opacity-70">
              <a href="/activities" className="block hover:text-[#C52A32] transition-colors">活动记录</a>
              <a href="/people" className="block hover:text-[#C52A32] transition-colors">人员介绍</a>
              <a href="/items" className="block hover:text-[#C52A32] transition-colors">物品展示</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-ui text-xs opacity-50">
            猫驼旅者客栈  2026 All rights reserved.
          </p>
          <p className="font-ui text-xs opacity-50 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#C52A32]" /> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
