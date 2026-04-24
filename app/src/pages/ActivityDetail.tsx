import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { Calendar, Users, ArrowLeft, ImageIcon } from 'lucide-react';
import gsap from 'gsap';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const activityId = parseInt(id || '0');
  const { data: activity, isLoading } = trpc.activity.getById.useQuery({ id: activityId });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activity) return;
    const ctx = gsap.context(() => {
      gsap.from('.detail-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.from('.detail-image', {
        scale: 1.05,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
      gsap.from('.detail-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
      });
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          delay: 0.6 + i * 0.1,
          ease: 'power3.out',
        });
      });
    }, contentRef);
    return () => ctx.revert();
  }, [activity]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] pt-24 px-4">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-black/10 w-1/3 mb-4" />
          <div className="h-96 bg-black/10 mb-6" />
          <div className="h-4 bg-black/10 w-full mb-2" />
          <div className="h-4 bg-black/10 w-2/3" />
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="font-heading text-3xl mb-4">活动未找到</h2>
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black font-ui text-sm tracking-wide hover:bg-black hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            返回活动列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-20" ref={contentRef}>
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/activities"
          className="inline-flex items-center gap-2 font-ui text-sm tracking-wide border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
      </div>

      {/* Header */}
      <div className="detail-header max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-4 text-sm font-ui opacity-50">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {activity.date}
          </span>
          {activity.participants && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {activity.participants}
            </span>
          )}
        </div>
        <h1 className="font-heading text-3xl md:text-5xl mb-4">{activity.title}</h1>
        {activity.summary && (
          <p className="font-body text-lg opacity-60 italic">{activity.summary}</p>
        )}
      </div>

      {/* Main Image */}
      {activity.images?.[0] && (
        <div className="detail-image max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="border-2 border-black overflow-hidden">
            <img
              src={activity.images[0]}
              alt={activity.title}
              className="w-full aspect-video object-cover"
              style={{ filter: 'sepia(0.15) contrast(1.05)' }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="detail-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="border-t-2 border-black pt-8">
          <div className="prose prose-lg max-w-none font-body leading-relaxed opacity-80">
            {activity.description?.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            )) || <p className="italic opacity-50">暂无详细描述</p>}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {activity.images && activity.images.length > 1 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t-2 border-dashed border-black pt-8">
            <h3 className="font-heading text-xl mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              活动相册
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activity.images.slice(1).map((image: string, index: number) => (
                <div
                  key={index}
                  className="gallery-item border-2 border-black overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-300"
                >
                  <img
                    src={image}
                    alt={`${activity.title} - ${index + 2}`}
                    className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
