import { Link } from 'react-router';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EBE5DB] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-8xl md:text-9xl text-[#C52A32] mb-4">404</div>
        <h1 className="font-heading text-3xl mb-4">迷路了？</h1>
        <p className="font-body text-base opacity-60 mb-8 max-w-md mx-auto">
          这页地图上似乎没有标注这个地方。别担心，回客栈的路 always open。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-black font-ui text-sm tracking-wide hover:bg-black hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <Link
            to="/activities"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C52A32] border-2 border-[#C52A32] text-white font-ui text-sm tracking-wide hover:bg-transparent hover:text-[#C52A32] transition-all"
          >
            <MapPin className="w-4 h-4" />
            探索活动
          </Link>
        </div>
      </div>
    </div>
  );
}
