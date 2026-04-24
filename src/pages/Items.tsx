import { useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc';
import { Calendar, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Items() {
  const { data: items, isLoading } = trpc.item.list.useQuery();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!items) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.item-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power3.out',
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [items]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] pt-24 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-12 bg-black/10 w-1/3 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-black/10" />
            ))}
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
          <h1 className="font-heading text-4xl md:text-6xl mb-4">物品展示</h1>
          <p className="font-body text-base opacity-60 max-w-xl">
            每一件物品都承载着一段记忆，它们是客栈故事的无声讲述者。
          </p>
        </div>
      </div>

      {/* Items Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item) => (
            <div
              key={item.id}
              className="item-card border-2 border-black bg-white overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-300 group"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#EBE5DB] flex items-center justify-center">
                    <BookOpen className="w-16 h-16 opacity-20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading text-lg mb-2 group-hover:text-[#C52A32] transition-colors">
                  {item.name}
                </h3>
                {item.date && (
                  <div className="flex items-center gap-1 text-xs font-ui opacity-40 mb-2">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </div>
                )}
                {item.description && (
                  <p className="font-body text-sm leading-relaxed opacity-60 line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
