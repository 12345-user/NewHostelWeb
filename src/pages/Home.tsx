import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc-client';
import { ArrowRight, BookOpen, Calendar, MapPin, Sparkles, Users } from 'lucide-react';
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
      className: 'bg-[#D7B861] text-[#20160C]',
      icon: Calendar,
    },
    {
      to: '/people',
      value: totalPeople,
      unit: '位成员',
      note: '主理人与伙伴',
      className: 'bg-[#8EB9BA] text-[#102021]',
      icon: Users,
    },
    {
      to: '/items',
      value: totalItems,
      unit: '件物品',
      note: '每件都有来处',
      className: 'bg-[#8FA783] text-[#141D12]',
      icon: BookOpen,
    },
    {
      to: '#about',
      value: '∞',
      unit: '个故事',
      note: '从入住开始发生',
      className: 'bg-[#A95A50] text-white',
      icon: Sparkles,
    },
  ];

  const quickLinks = [
    {
      to: '/activities',
      title: '活动记录',
      desc: '按时间线浏览客栈里的聚会、手作和旅行片段。',
      meta: `${totalActivities} 条内容`,
      icon: Calendar,
      color: '#A95A50',
    },
    {
      to: '/people',
      title: '人员介绍',
      desc: '认识主理人、伙伴和让这里有温度的人。',
      meta: `${totalPeople} 位成员`,
      icon: Users,
      color: '#477F82',
    },
    {
      to: '/items',
      title: '物品展示',
      desc: '查看招牌、空间角落和被旅人留下的故事物件。',
      meta: `${totalItems} 件物品`,
      icon: BookOpen,
      color: '#687B59',
    },
    {
      to: '#about',
      title: '联系预订',
      desc: '查看地址和客栈信息，方便确认到店前的细节。',
      meta: '地址 / 介绍',
      icon: MapPin,
      color: '#C09A43',
    },
  ];

  const renderNavLink = (to: string, className: string, children: React.ReactNode) => {
    if (to.startsWith('#')) {
      return (
        <a href={to} className={className}>
          {children}
        </a>
      );
    }

    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <div className="bg-[#EBE5DB]">
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})`, filter: 'sepia(0.2) contrast(1.1)' }} />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-white">
          <div className="hero-title text-center">
            <h1 className="font-heading mb-4 text-5xl tracking-wider md:text-7xl lg:text-8xl xl:text-9xl">
              {heroSlides[currentSlide].title}
            </h1>
          </div>
          <div className="hero-subtitle text-center">
            <p className="font-display text-2xl italic opacity-90 md:text-3xl">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>
          <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/activities" className="border-2 border-white px-10 py-4 font-ui text-base tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black md:text-lg">
              探索活动
            </Link>
            <Link to="/people" className="border-2 border-[#C52A32] bg-[#C52A32] px-10 py-4 font-ui text-base tracking-wider text-white transition-all duration-300 hover:bg-transparent hover:text-white md:text-lg">
              认识我们
            </Link>
          </div>

          <div className="absolute bottom-8 flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                aria-label={`切换到第 ${index + 1} 张图`}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 w-3 border-2 border-white transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section ref={feedRef} className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center justify-between border-b-2 border-black pb-4">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl">最新动态</h2>
              <p className="mt-1 font-body text-sm opacity-60">客栈里刚刚发生的故事</p>
            </div>
            <Link to="/activities" className="hidden items-center gap-2 border-2 border-black px-4 py-2 font-ui text-sm tracking-wide transition-all hover:bg-black hover:text-white sm:flex">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestActivities.map((activity) => (
              <Link key={activity.id} to={`/activities/${activity.id}`} className="feed-card group overflow-hidden border-2 border-black bg-white transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                <div className="aspect-video overflow-hidden">
                  <img src={activity.images?.[0] || '/images/activity-1.jpg'} alt={activity.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2 font-ui text-xs opacity-50">
                    <Calendar className="h-3 w-3" />
                    {activity.date}
                  </div>
                  <h3 className="font-heading mb-2 text-lg transition-colors group-hover:text-[#C52A32]">{activity.title}</h3>
                  <p className="line-clamp-2 font-body text-sm opacity-60">{activity.summary}</p>
                  {activity.participants && (
                    <div className="mt-3 flex items-center gap-2 font-ui text-xs opacity-40">
                      <Users className="h-3 w-3" />
                      {activity.participants}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-2 border-dashed border-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-black pb-3">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl">数据一览</h2>
                  <p className="mt-1 font-body text-sm opacity-60">点击卡片可直达对应内容</p>
                </div>
                <span className="hidden border-2 border-black px-3 py-1 font-ui text-xs tracking-wide sm:inline-block">LIVE</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return renderNavLink(
                    stat.to,
                    `group relative min-h-[182px] border-2 border-black p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.18)] ${stat.className}`,
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-display text-5xl leading-none">{stat.value}</div>
                          <div className="mt-2 font-ui text-sm font-semibold tracking-wider">{stat.unit}</div>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center border-2 border-current bg-white/10">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3">
                        <p className="line-clamp-1 font-body text-xs opacity-75">{stat.note}</p>
                        <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </div>
                    </>,
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-8 border-b-2 border-black pb-3">
                <h2 className="font-heading text-3xl md:text-4xl">快速入口</h2>
                <p className="mt-1 font-body text-sm opacity-60">按浏览目的选择下一站</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return renderNavLink(
                    link.to,
                    'group relative min-h-[182px] border-2 border-black bg-[#F7F0E6] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFF9EE] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.16)]',
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-heading text-xl">{link.title}</div>
                          <div className="mt-1 inline-flex border border-black/40 px-2 py-0.5 font-ui text-[0.68rem] opacity-70">{link.meta}</div>
                        </div>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black bg-white" style={{ color: link.color }}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-5 font-body text-sm leading-relaxed opacity-65">{link.desc}</p>
                      <div className="absolute bottom-4 right-5">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </>,
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-t-2 border-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block border-2 border-black px-4 py-1">
            <span className="font-ui text-xs uppercase tracking-widest">关于我们</span>
          </div>
          <h2 className="font-heading mb-6 text-3xl md:text-5xl">初来乍到，欢迎！</h2>
          <p className="mx-auto max-w-2xl font-body text-base leading-relaxed opacity-70 md:text-lg">
            猫驼旅者客栈诞生于对慢生活的向往。我们相信，每一次停留都是一次相遇，
            每一个故事都值得被记录。在这里，你可以放下行李，也可以放下心事。
            无论你是匆匆过客还是长久驻足，这里总有一盏灯为你留着。
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 font-ui text-sm opacity-50">
            <MapPin className="h-4 w-4 text-[#C52A32]" />
            <span>云南省大理市古城内 / 始于 2024</span>
          </div>
        </div>
      </section>
    </div>
  );
}
