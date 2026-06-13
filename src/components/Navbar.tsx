import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Compass, Menu, Shield, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const canManage = user?.role === 'owner' || user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/activities', label: '活动' },
    { path: '/people', label: '人员' },
    { path: '/items', label: '物品' },
    { path: '/about', label: '详情' },
  ];

  const solid = scrolled || isOpen || location.pathname !== '/';

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'border-b-2 border-black bg-[#EBE5DB]/96 shadow-[0_8px_24px_rgba(42,34,22,0.08)] backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="group flex min-w-0 items-center gap-2">
            <Compass className="h-6 w-6 shrink-0 text-[#C52A32] transition-transform duration-300 group-hover:rotate-45" />
            <span className={`truncate font-heading text-base tracking-wider sm:text-lg ${solid ? 'text-black' : 'text-white lg:text-black'}`}>
              猫驼旅者客栈
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-[#F4EFE6]/85 px-2 py-1.5 shadow-[0_10px_30px_rgba(42,34,22,0.08)] backdrop-blur-md lg:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-4 py-2 font-ui text-[0.95rem] font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? 'bg-[#D7B85A] text-[#1F1A14] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08),0_6px_14px_rgba(126,91,18,0.14)]'
                      : 'text-[#493D2F] hover:bg-white/60 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {canManage && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 rounded-full px-4 py-2 font-ui text-[0.95rem] font-medium tracking-wide transition-all duration-200 ${
                  location.pathname === '/admin'
                    ? 'bg-[#A83332] text-white shadow-[0_6px_14px_rgba(168,51,50,0.18)]'
                    : 'text-[#493D2F] hover:bg-white/60 hover:text-black'
                }`}
              >
                <Shield className="h-4 w-4" />
                后台
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="ml-1 rounded-full bg-[#24201B] px-5 py-2 font-ui text-[0.95rem] font-semibold tracking-wide text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-all duration-200 hover:bg-[#3A3027]"
              >
                退出
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-1 rounded-full bg-[#24201B] px-5 py-2 font-ui text-[0.95rem] font-semibold tracking-wide text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-all duration-200 hover:bg-[#3A3027]"
              >
                登录
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={isOpen}
            className={`flex h-11 w-11 items-center justify-center border-2 transition-colors duration-200 lg:hidden ${
              solid ? 'border-black bg-[#F7F0E6] text-black' : 'border-white bg-black/35 text-white backdrop-blur-sm'
            }`}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t-2 border-black bg-[#F3EEE4] shadow-[0_12px_30px_rgba(0,0,0,0.18)] lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block border-2 px-4 py-3 font-ui text-base tracking-wide text-black transition-all ${
                  location.pathname === link.path ? 'border-black bg-[#D7B85A] font-semibold' : 'border-transparent bg-white/45 hover:border-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {canManage && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block border-2 border-transparent bg-white/45 px-4 py-3 font-ui text-base tracking-wide text-black hover:border-black"
              >
                管理后台
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="block w-full border-2 border-black px-4 py-3 text-left font-ui text-base tracking-wide text-black transition-all hover:bg-black hover:text-white"
              >
                退出登录
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block border-2 border-black bg-black px-4 py-3 font-ui text-base tracking-wide text-white"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
