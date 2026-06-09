import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Compass, Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const canManage = user?.role === 'owner' || user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/activities', label: '活动' },
    { path: '/people', label: '人员' },
    { path: '/items', label: '物品' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#EBE5DB]/95 backdrop-blur-sm border-b-2 border-black'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Compass className="w-6 h-6 text-[#C52A32] group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-heading text-lg tracking-wider text-black">
              猫驼旅者客栈
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 rounded-full border border-black/10 bg-[#F4EFE6]/82 px-2 py-1.5 shadow-[0_10px_30px_rgba(42,34,22,0.08)] backdrop-blur-md">
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
                <Shield className="w-4 h-4" />
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
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '关闭菜单' : '打开菜单'}
            className={`lg:hidden p-2 border-2 transition-colors duration-200 ${
              scrolled
                ? 'border-black text-black bg-transparent'
                : 'border-white text-white bg-black/35 backdrop-blur-sm'
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#F3EEE4] border-b-2 border-black shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 font-ui text-base tracking-wide text-black border-2 border-transparent hover:border-black hover:bg-[#E8E1D5] ${
                  location.pathname === link.path
                    ? 'border-black bg-[#F6C347] font-semibold'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            {canManage && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 font-ui text-base tracking-wide text-black border-2 border-transparent hover:border-black hover:bg-[#E8E1D5]"
              >
                管理后台
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-3 font-ui text-base tracking-wide border-2 border-black text-black hover:bg-black hover:text-white transition-all"
              >
                退出登录
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 font-ui text-base tracking-wide border-2 border-black bg-black text-white"
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
