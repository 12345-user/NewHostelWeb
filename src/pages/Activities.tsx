import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc-client';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Activities() {
  const { data: activities, isLoading } = trpc.activity.list.useQuery();
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activities) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 88%' },
          x: i % 2 === 0 ? -24 : 24,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
        });
      });
    }, timelineRef);
    return () => ctx.revert();
  }, [activities]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] px-4 pt-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-4 h-10 w-1/2 bg-black/10 sm:w-1/3" />
          <div className="h-4 w-2/3 bg-black/10" />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-64 bg-black/10" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-16">
      <div className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-4xl md:text-6xl">活动记录</h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed opacity-60">
            以时间线记录客栈里的每一次相聚与欢笑，这里承载着我们的共同记忆。
          </p>
        </div>
      </div>

      <div ref={timelineRef} className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-black/20 md:left-1/2 md:-translate-x-px" />

          {activities?.map((activity, index) => (
            <div key={activity.id} className={`timeline-item relative mb-10 flex items-start gap-8 sm:mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-4 z-10 mt-6 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-black bg-[#C52A32] md:left-1/2" />

              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                <Link to={`/activities/${activity.id}`} className="group block overflow-hidden border-2 border-black bg-white transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                  {activity.images?.[0] && (
                    <div className="aspect-video overflow-hidden">
                      <img src={activity.images[0]} alt={activity.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                    </div>
                  )}
                  <div className="p-4 sm:p-5">
                    <div className={`mb-2 flex items-center gap-2 font-ui text-xs opacity-50 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      {activity.date}
                    </div>
                    <h3 className="font-heading mb-2 text-xl transition-colors group-hover:text-[#C52A32]">{activity.title}</h3>
                    <p className="line-clamp-2 font-body text-sm opacity-60">{activity.summary}</p>
                    {activity.participants && (
                      <div className={`mt-3 flex items-center gap-2 font-ui text-xs opacity-40 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <Users className="h-3 w-3" />
                        {activity.participants}
                      </div>
                    )}
                    <div className={`mt-3 flex items-center gap-1 font-ui text-sm text-[#C52A32] ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      查看详情
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>

              <div className="hidden md:block md:w-[calc(50%-2rem)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
