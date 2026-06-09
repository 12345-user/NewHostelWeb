import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc-client';
import { Calendar, Users, ArrowRight, BookOpen, MapPin, Sparkles } from 'lucide-react';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 });
      gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
      gsap.from('.hero-cta', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 });

      gsap.utils.toArray<HTMLElement>('.feed-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });

      gsap.from('.dashboard-item', {
        scrollTrigger: { trigger: dashboardRef.current, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const latestActivities = activities?.slice(0, 3) || [];
  const totalPeople = people?.length || 0;
  const totalItems = items?.length || 0;
  const totalActivities = activities?.length || 0;
  const latestActivity = activities?.[0];

  const stats = [
    {
      to: '/activities',
      value: totalActivities,
      unit: '场活动',
      note: latestActivity ? `最近：${latestActivity.title}` : '等待第一场相聚',
      className: 'bg-[#F6C347] text-black',
      icon: Calendar,
    },
    {
      to: '/people',
      value: totalPeople,
      unit: '位成员',
      note: '主理人与伙伴',
      className: 'bg-[#0E92A9] text-white',
      icon: Users,
    },
    {
      to: '/items',
      value: totalItems,
      unit: '件物品',
      note: '每件都有来处',
      className: 'bg-[#5D9484] text-white',
      icon: BookOpen,
    },
    {
      to: '/activities',
      value: '∞',
      unit: '个故事',
      note: '从入住开始发生',
      className: 'bg-[#C52A32] text-white',
      icon: Sparkles,
    },
  ];

  const quickLinks = [
    {
      to: '/activities',
      title: '活动记录',
      desc: '按时间线浏览客栈里的聚会、手作和旅行片段',
      meta: `${totalActivities} 条内容`,
      icon: Calendar,
      color: '#C52A32',
    },
    {
      to: '/people',
      title: '人员介绍',
      desc: '认识主理人、伙伴和让这里有温度的人',
      meta: `${totalPeople} 位成员`,
      icon: Users,
      color: '#0E92A9',
    },
    {
      to: '/items',
      title: '物品展示',
      desc: '查看招牌、空间角落和那些被留下的故事物件',
      meta: `${totalItems} 件物品`,
      icon: BookOpen,
      color: '#5D9484',
    },
  ];

  return (
    <div className="bg-[#EBE5DB]">
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})`, filter: 'sepia(0.2) contrast(1.1)' }} />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <div className="hero-title text-center">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 tracking-wider">
              {heroSlides[currentSlide].title}
            </h1>
          </div>
          <div className="hero-subtitle text-center">
            <p className="font-display text-2xl md:text-3xl italic opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>
          <div className="hero-cta mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/activities" className="px-10 py-4 border-2 border-white text-white font-ui text-base md:text-lg tracking-wider hover:bg-white hover:text-black transition-all duration-300">
              探索活动
            </Link>
            <Link to="/people" className="px-10 py-4 bg-[#C52A32] border-2 border-[#C52A32] text-white font-ui text-base md:text-lg tracking-wider hover:bg-transparent hover:text-white transition-all duration-300">
              认识我们
            </Link>
          </div>

          <div className="absolute bottom-8 flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                aria-label={`切换到第 ${index + 1} 张图`}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 border-2 border-white transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section ref={feedRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b-2 border-black pb-4">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl">最新动态</h2>
              <p className="font-body text-sm opacity-60 mt-1">客栈里刚刚发生的故事</p>
            </div>
            <Link to="/activities" className="hidden sm:flex items-center gap-2 font-ui text-sm tracking-wide border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestActivities.map((activity) => (
              <Link key={activity.id} to={`/activities/${activity.id}`} className="feed-card group border-2 border-black bg-white overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img src={activity.images?.[0] || '/images/activity-1.jpg'} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-ui opacity-50 mb-2">
                    <Calendar className="w-3 h-3" />
                    {activity.date}
                  </div>
                  <h3 className="font-heading text-lg mb-2 group-hover:text-[#C52A32] transition-colors">{activity.title}</h3>
                  <p className="font-body text-sm opacity-60 line-clamp-2">{activity.summary}</p>
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

      <section ref={dashboardRef} className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black border-dashed">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-black pb-3">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl">数据一览</h2>
                  <p className="font-body text-sm opacity-60 mt-1">点击卡片可直达对应内容</p>
                </div>
                <span className="hidden sm:inline-block border-2 border-black px-3 py-1 font-ui text-xs tracking-wide">LIVE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Link
                      key={stat.unit}
                      to={stat.to}
                      aria-label={`查看${stat.unit}`}
                      className={`dashboard-item group relative min-h-[150px] border-2 border-black p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.18)] ${stat.className}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-display text-5xl leading-none">{stat.value}</div>
                          <div className="font-ui text-sm mt-2 font-semibold tracking-wider">{stat.unit}</div>
                        </div>
                        <div className="w-11 h-11 border-2 border-current flex items-center justify-center bg-white/10">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="absolute left-5 right-5 bottom-4 flex items-center justify-between gap-3">
                        <p className="font-body text-xs opacity-75 line-clamp-1">{stat.note}</p>
                        <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-black pb-3">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl">快速入口</h2>
                  <p className="font-body text-sm opacity-60 mt-1">按浏览目的选择下一站</p>
                </div>
              </div>

              <div className="space-y-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="dashboard-item group flex min-h-[118px] items-center gap-4 border-2 border-black bg-[#F8F3EA] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_rgba(0,0,0,0.16)]"
                    >
                      <div className="w-14 h-14 border-2 border-current flex items-center justify-center shrink-0 bg-white/30" style={{ color: link.color }}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-heading text-xl">{link.title}</div>
                          <span className="hidden sm:inline-flex border border-current px-2 py-0.5 font-ui text-[0.68rem] opacity-60">{link.meta}</span>
                        </div>
                        <div className="font-body text-sm opacity-65 mt-1 leading-relaxed">{link.desc}</div>
                      </div>
                      <div className="w-10 h-10 border-2 border-current flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <span>云南省大理市古城内 / 始于 2024</span>
          </div>
        </div>
      </section>
    </div>
  );
}
