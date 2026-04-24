import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { Calendar, Users, ArrowRight, BookOpen, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroSlides = [
  { image: '/images/hero-1.jpg', title: '每一次出发', subtitle: '都是新的故事' },
  { image: '/images/hero-2.jpg', title: '在这里相遇', subtitle: '分享旅途的温度' },
  { image: '/images/hero-3.jpg', title: '猫驼旅者客栈', subtitle: '你的旅途之家' },
];

export default function Home() {
  const { data: activities } = trpc.activity.list.useQuery();
  const { data: people } = trpc.people.list.useQuery();
  const { data: items } = trpc.item.list.useQuery();
  const heroRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
      });
      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6,
      });
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.9,
      });

      // Feed section cards
      gsap.utils.toArray<HTMLElement>('.feed-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });

      // Dashboard animations
      gsap.from('.dashboard-item', {
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const latestActivities = activities?.slice(0, 3) || [];
  const totalPeople = people?.length || 0;
  const totalItems = items?.length || 0;
  const totalActivities = activities?.length || 0;

  return (
    <div className="bg-[#EBE5DB]">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: 'sepia(0.2) contrast(1.1)',
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <div className="hero-title text-center">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl mb-4 tracking-wider">
              {heroSlides[currentSlide].title}
            </h1>
          </div>
          <div className="hero-subtitle text-center">
            <p className="font-display text-xl md:text-2xl italic opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>
          <div className="hero-cta mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/activities"
              className="px-8 py-3 border-2 border-white text-white font-ui text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              探索活动
            </Link>
            <Link
              to="/people"
              className="px-8 py-3 bg-[#C52A32] border-2 border-[#C52A32] text-white font-ui text-sm tracking-wider hover:bg-transparent hover:text-white transition-all duration-300"
            >
              认识我们
            </Link>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 border-2 border-white transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Retro clock decoration */}
          <div className="absolute top-24 right-8 hidden lg:block">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-4 border-white/30" />
              <div className="absolute inset-2 rounded-full border border-white/20" />
              <div
                className="absolute top-1/2 left-1/2 w-1 h-12 bg-[#C52A32] origin-bottom"
                style={{ animation: 'rotate 60s linear infinite', transform: 'translateX(-50%)' }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-[#0E92A9] origin-bottom"
                style={{ animation: 'rotate 10s linear infinite', transform: 'translateX(-50%)' }}
              />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Feed Section - Featured Activities */}
      <section ref={feedRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b-2 border-black pb-4">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl">最新动态</h2>
              <p className="font-body text-sm opacity-60 mt-1">客栈里刚刚发生的故事</p>
            </div>
            <Link
              to="/activities"
              className="hidden sm:flex items-center gap-2 font-ui text-sm tracking-wide border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestActivities.map((activity) => (
              <Link
                key={activity.id}
                to={`/activities/${activity.id}`}
                className="feed-card group border-2 border-black bg-white overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={activity.images?.[0] || '/images/activity-1.jpg'}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-ui opacity-50 mb-2">
                    <Calendar className="w-3 h-3" />
                    {activity.date}
                  </div>
                  <h3 className="font-heading text-lg mb-2 group-hover:text-[#C52A32] transition-colors">
                    {activity.title}
                  </h3>
                  <p className="font-body text-sm opacity-60 line-clamp-2">
                    {activity.summary}
                  </p>
                  {activity.participants && (
                    <div className="flex items-center gap-2 mt-3 text-xs font-ui opacity-40">
                      <Users className="w-3 h-3" />
                      {activity.participants}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section ref={dashboardRef} className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black border-dashed">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Stats */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl mb-8">数据一览</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="dashboard-item border-2 border-black p-6 bg-[#F6C347]">
                  <div className="font-display text-4xl md:text-5xl text-black">{totalActivities}</div>
                  <div className="font-ui text-sm mt-2 uppercase tracking-wider">场活动</div>
                </div>
                <div className="dashboard-item border-2 border-black p-6 bg-[#0E92A9] text-white">
                  <div className="font-display text-4xl md:text-5xl">{totalPeople}</div>
                  <div className="font-ui text-sm mt-2 uppercase tracking-wider">位成员</div>
                </div>
                <div className="dashboard-item border-2 border-black p-6 bg-[#5D9484] text-white">
                  <div className="font-display text-4xl md:text-5xl">{totalItems}</div>
                  <div className="font-ui text-sm mt-2 uppercase tracking-wider">件物品</div>
                </div>
                <div className="dashboard-item border-2 border-black p-6 bg-[#C52A32] text-white">
                  <div className="font-display text-4xl md:text-5xl">∞</div>
                  <div className="font-ui text-sm mt-2 uppercase tracking-wider">个故事</div>
                </div>
              </div>
            </div>

            {/* Right - Quick Links */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl mb-8">快速入口</h2>
              <div className="space-y-4">
                <Link
                  to="/activities"
                  className="dashboard-item flex items-center gap-4 border-2 border-black p-4 hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <div className="w-12 h-12 border-2 border-current flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading text-lg">活动记录</div>
                    <div className="font-body text-sm opacity-60">浏览所有精彩活动</div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/people"
                  className="dashboard-item flex items-center gap-4 border-2 border-black p-4 hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <div className="w-12 h-12 border-2 border-current flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading text-lg">人员介绍</div>
                    <div className="font-body text-sm opacity-60">认识客栈的伙伴们</div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/items"
                  className="dashboard-item flex items-center gap-4 border-2 border-black p-4 hover:bg-black hover:text-white transition-all duration-300 group"
                >
                  <div className="w-12 h-12 border-2 border-current flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading text-lg">物品展示</div>
                    <div className="font-body text-sm opacity-60">每一件都有故事</div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border-2 border-black px-4 py-1 mb-6">
            <span className="font-ui text-xs tracking-widest uppercase">关于我们</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl mb-6">初来乍到，欢迎！</h2>
          <p className="font-body text-base md:text-lg leading-relaxed opacity-70 max-w-2xl mx-auto">
            猫驼旅者客栈诞生于对慢生活的向往。我们相信，每一次停留都是一次相遇，
            每一个故事都值得被记录。在这里，你可以放下行李，也可以放下心事。
            无论你是匆匆过客还是长久驻足，这里总有一盏灯为你留着。
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-ui opacity-50">
            <MapPin className="w-4 h-4 text-[#C52A32]" />
            <span>云南省大理市古城内 · 始于 2024</span>
          </div>
        </div>
      </section>
    </div>
  );
}
