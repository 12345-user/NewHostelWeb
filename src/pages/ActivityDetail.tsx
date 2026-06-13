import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router';
import { trpc } from '@/providers/trpc-client';
import { ArrowLeft, Calendar, ImageIcon, Users } from 'lucide-react';
import gsap from 'gsap';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');
  const { data: activity, isLoading } = trpc.activity.getById.useQuery({ id: activityId });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activity) return;
    const ctx = gsap.context(() => {
      gsap.from('.detail-header', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' });
      gsap.from('.detail-image', { scale: 1.03, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 });
      gsap.from('.detail-content', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 });
    }, contentRef);
    return () => ctx.revert();
  }, [activity]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] px-4 pt-24">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-4 h-8 w-1/3 bg-black/10" />
          <div className="mb-6 h-72 bg-black/10 sm:h-96" />
          <div className="mb-2 h-4 w-full bg-black/10" />
          <div className="h-4 w-2/3 bg-black/10" />
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] px-4 pt-24">
        <div className="mx-auto max-w-4xl py-20 text-center">
          <h2 className="mb-4 font-heading text-3xl">活动未找到</h2>
          <Link to="/activities" className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 font-ui text-sm tracking-wide transition-all hover:bg-black hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            返回活动列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-16" ref={contentRef}>
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link to="/activities" className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-ui text-sm tracking-wide transition-all hover:bg-black hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>
      </div>

      <div className="detail-header mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-ui text-sm opacity-50">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {activity.date}
          </span>
          {activity.participants && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {activity.participants}
            </span>
          )}
        </div>
        <h1 className="mb-4 font-heading text-3xl leading-tight md:text-5xl">{activity.title}</h1>
        {activity.summary && <p className="font-body text-base italic leading-relaxed opacity-60 sm:text-lg">{activity.summary}</p>}
      </div>

      {activity.images?.[0] && (
        <div className="detail-image mx-auto mb-8 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden border-2 border-black">
            <img src={activity.images[0]} alt={activity.title} className="aspect-video w-full object-cover" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
          </div>
        </div>
      )}

      <div className="detail-content mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="border-t-2 border-black pt-8">
          <div className="max-w-none font-body text-base leading-8 opacity-80 sm:text-lg">
            {activity.description?.split('\n').map((paragraph, i) => <p key={i} className="mb-4">{paragraph}</p>) || <p className="italic opacity-50">暂无详细描述</p>}
          </div>
        </div>
      </div>

      {activity.images && activity.images.length > 1 && (
        <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="border-t-2 border-dashed border-black pt-8">
            <h3 className="mb-6 flex items-center gap-2 font-heading text-xl">
              <ImageIcon className="h-5 w-5" />
              活动相册
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {activity.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="gallery-item overflow-hidden border-2 border-black transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                  <img src={image} alt={`${activity.title} - ${index + 2}`} className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
