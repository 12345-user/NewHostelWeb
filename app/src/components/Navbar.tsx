import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Compass, Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Compass className="w-6 h-6 text-[#C52A32] group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-heading text-lg tracking-wider text-black">
              猫驼旅者客栈
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 font-ui text-sm tracking-wide transition-all duration-200 border-2 border-transparent hover:border-black ${
                  location.pathname === link.path
                    ? 'border-black bg-[#F6C347]'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 font-ui text-sm tracking-wide transition-all duration-200 border-2 border-transparent hover:border-black flex items-center gap-1 ${
                  location.pathname === '/admin'
                    ? 'border-black bg-[#C52A32] text-white'
                    : ''
                }`}
              >
                <Shield className="w-4 h-4" />
                管理
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 font-ui text-sm tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                退出
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 font-ui text-sm tracking-wide border-2 border-black bg-black text-white hover:bg-transparent hover:text-black transition-all duration-200"
              >
                登录
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border-2 border-black"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#EBE5DB] border-b-2 border-black">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 font-ui text-sm tracking-wide border-2 border-transparent hover:border-black ${
                  location.pathname === link.path
                    ? 'border-black bg-[#F6C347]'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-3 font-ui text-sm tracking-wide border-2 border-transparent hover:border-black"
              >
                管理后台
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-3 font-ui text-sm tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all"
              >
                退出登录
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-3 font-ui text-sm tracking-wide border-2 border-black bg-black text-white"
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
