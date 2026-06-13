import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc-client';
import { ArrowRight, BookOpen, Calendar, Compass, MapPin, Sparkles, Users } from 'lucide-react';
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
      gsap.from('.hero-title', { y: 42, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-subtitle', { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.45 });
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.65 });

      gsap.utils.toArray<HTMLElement>('.feed-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          y: 36,
          opacity: 0,
          duration: 0.65,
          delay: i * 0.08,
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
  const latestItem = items?.[0];

  const stats = [
    {
      value: totalActivities,
      unit: '场活动',
      label: '运营内容',
      note: latestActivity ? `最近更新：${latestActivity.title}` : '等待第一场相聚',
      className: 'bg-[#D7B861] text-[#20160C]',
      icon: Calendar,
    },
    {
      value: totalPeople,
      unit: '位成员',
      label: '团队档案',
      note: '主理人与常驻伙伴',
      className: 'bg-[#8EB9BA] text-[#102021]',
      icon: Users,
    },
    {
      value: totalItems,
      unit: '件物品',
      label: '空间记忆',
      note: latestItem ? `最新物件：${latestItem.name}` : '每件都有来处',
      className: 'bg-[#8FA783] text-[#141D12]',
      icon: BookOpen,
    },
    {
      value: '∞',
      unit: '个故事',
      label: '旅人回声',
      note: '从入住开始发生',
      className: 'bg-[#A95A50] text-white',
      icon: Sparkles,
    },
  ];

  const quickLinks = [
    {
      to: '/activities',
      title: '看最新活动',
      desc: latestActivity ? `从「${latestActivity.title}」开始，查看客栈最近发生的事。` : '按时间线浏览客栈里的聚会、手作和旅行片段。',
      meta: '故事时间线',
      icon: Calendar,
      color: '#A95A50',
    },
    {
      to: '/people',
      title: '认识主理人',
      desc: '了解负责接待、拍摄、整理故事和维护客栈日常的人。',
      meta: '团队介绍',
      icon: Users,
      color: '#477F82',
    },
    {
      to: '/items',
      title: '逛空间物件',
      desc: '查看招牌、院落角落、房间小物和旅人留下的纪念。',
      meta: '物件陈列',
      icon: BookOpen,
      color: '#687B59',
    },
    {
      to: '/about',
      title: '查看详情页',
      desc: '进入独立详情页，查看地址、入住提示和客栈介绍。',
      meta: '客栈详情',
      icon: MapPin,
      color: '#C09A43',
    },
  ];

  const renderActionLink = (to: string, className: string, children: ReactNode) => {
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
      <section ref={heroRef} className="relative min-h-[640px] overflow-hidden sm:h-screen">
        {heroSlides.map((slide, index) => (
          <div key={slide.image} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})`, filter: 'sepia(0.2) contrast(1.1)' }} />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ))}

        <div className="relative z-10 flex min-h-[640px] flex-col items-center justify-center px-4 pb-16 pt-24 text-white sm:h-full sm:pb-0">
          <div className="hero-title max-w-[92vw] text-center">
            <h1 className="font-heading mb-4 text-5xl leading-tight tracking-normal sm:text-7xl lg:text-8xl xl:text-9xl">
              {heroSlides[currentSlide].title}
            </h1>
          </div>
          <div className="hero-subtitle text-center">
            <p className="font-display text-xl italic opacity-90 sm:text-2xl md:text-3xl">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>
          <div className="hero-cta mt-9 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
            <Link to="/activities" className="w-full border-2 border-white px-7 py-3.5 text-center font-ui text-base tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-auto sm:px-10 sm:py-4 md:text-lg">
              探索活动
            </Link>
            <Link to="/people" className="w-full border-2 border-[#C52A32] bg-[#C52A32] px-7 py-3.5 text-center font-ui text-base tracking-wider text-white transition-all duration-300 hover:bg-transparent hover:text-white sm:w-auto sm:px-10 sm:py-4 md:text-lg">
              认识我们
            </Link>
          </div>

          <div className="absolute bottom-7 flex gap-3">
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

      <section ref={feedRef} className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 border-b-2 border-black pb-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl">最新动态</h2>
              <p className="mt-1 font-body text-sm opacity-60">客栈里刚刚发生的故事</p>
            </div>
            <Link to="/activities" className="inline-flex w-fit items-center gap-2 border-2 border-black px-4 py-2 font-ui text-sm tracking-wide transition-all hover:bg-black hover:text-white">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestActivities.map((activity) => (
              <Link key={activity.id} to={`/activities/${activity.id}`} className="feed-card group overflow-hidden border-2 border-black bg-white transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                <div className="aspect-video overflow-hidden">
                  <img src={activity.images?.[0] || '/images/activity-1.jpg'} alt={activity.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                </div>
                <div className="p-4 sm:p-5">
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

      <section className="border-t-2 border-dashed border-black px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-black pb-3 sm:mb-8">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl">数据一览</h2>
                  <p className="mt-1 font-body text-sm opacity-60">展示当前内容体量，不再重复导航</p>
                </div>
                <span className="hidden border-2 border-black px-3 py-1 font-ui text-xs tracking-wide sm:inline-block">LIVE</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <article key={stat.unit} className={`relative min-h-[148px] border-2 border-black p-4 sm:min-h-[176px] sm:p-5 ${stat.className}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-display text-4xl leading-none sm:text-5xl">{stat.value}</div>
                          <div className="mt-2 font-ui text-xs font-semibold tracking-wider sm:text-sm">{stat.unit}</div>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-current bg-white/10 sm:h-11 sm:w-11">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5">
                        <div className="mb-1 font-ui text-[0.65rem] tracking-widest opacity-70">{stat.label}</div>
                        <p className="line-clamp-1 font-body text-xs opacity-75">{stat.note}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-black pb-3 sm:mb-8">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl">快速入口</h2>
                  <p className="mt-1 font-body text-sm opacity-60">选择具体动作，进入对应页面</p>
                </div>
                <Compass className="hidden h-9 w-9 text-[#A95A50] sm:block" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return renderActionLink(
                    link.to,
                    'group relative min-h-[152px] border-2 border-black bg-[#F7F0E6] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFF9EE] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.16)] sm:min-h-[176px] sm:p-5',
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-heading text-lg sm:text-xl">{link.title}</div>
                          <div className="mt-1 inline-flex border border-black/40 px-2 py-0.5 font-ui text-[0.68rem] opacity-70">{link.meta}</div>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-white sm:h-11 sm:w-11" style={{ color: link.color }}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 pr-5 font-body text-sm leading-relaxed opacity-65 sm:mt-5">{link.desc}</p>
                      <div className="absolute bottom-4 right-4 sm:right-5">
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

      <section id="about" className="border-t-2 border-black px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block border-2 border-black px-4 py-1">
            <span className="font-ui text-xs uppercase tracking-widest">关于我们</span>
          </div>
          <h2 className="font-heading mb-6 text-3xl md:text-5xl">初来乍到，欢迎！</h2>
          <p className="mx-auto max-w-2xl font-body text-base leading-relaxed opacity-70 md:text-lg">
            猫驼旅者客栈诞生于对慢生活的向往。我们相信，每一次停留都是一次相遇，每一个故事都值得被记录。
            在这里，你可以放下行李，也可以放下心事。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-ui text-sm opacity-50">
            <MapPin className="h-4 w-4 text-[#C52A32]" />
            <span>云南省大理市古城内 / 始于 2024</span>
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 border-2 border-black px-5 py-3 font-ui text-sm tracking-wide transition-all hover:bg-black hover:text-white"
          >
            查看完整详情
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
