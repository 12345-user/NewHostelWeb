import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc-client';
import { Calendar, Users, ArrowRight } from 'lucide-react';
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
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
          x: i % 2 === 0 ? -40 : 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });
    }, timelineRef);
    return () => ctx.revert();
  }, [activities]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-black/10 w-1/3" />
            <div className="h-4 bg-black/10 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-black/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-20">
      {/* Header */}
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-heading text-4xl md:text-6xl mb-4">活动记录</h1>
          <p className="font-body text-base opacity-60 max-w-xl">
            以时间线记录客栈里的每一次相聚与欢笑，这里承载着我们的共同记忆。
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-black/20 md:-translate-x-px" />

          {activities?.map((activity, index) => (
            <div
              key={activity.id}
              className={`timeline-item relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#C52A32] border-2 border-black rounded-full -translate-x-1/2 mt-6 z-10" />

              {/* Content card */}
              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
              }`}>
                <Link
                  to={`/activities/${activity.id}`}
                  className="group block border-2 border-black bg-white overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-300"
                >
                  {activity.images?.[0] && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={activity.images[0]}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className={`flex items-center gap-2 text-xs font-ui opacity-50 mb-2 ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                      <Calendar className="w-3 h-3" />
                      {activity.date}
                    </div>
                    <h3 className="font-heading text-xl mb-2 group-hover:text-[#C52A32] transition-colors">
                      {activity.title}
                    </h3>
                    <p className="font-body text-sm opacity-60 line-clamp-2">
                      {activity.summary}
                    </p>
                    {activity.participants && (
                      <div className={`flex items-center gap-2 mt-3 text-xs font-ui opacity-40 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        <Users className="w-3 h-3" />
                        {activity.participants}
                      </div>
                    )}
                    <div className={`mt-3 flex items-center gap-1 text-sm font-ui text-[#C52A32] opacity-0 group-hover:opacity-100 transition-opacity ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                      查看详情
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-[calc(50%-2rem)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
