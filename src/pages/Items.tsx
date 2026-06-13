import { useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc-client';
import { BookOpen, Calendar } from 'lucide-react';
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
          scrollTrigger: { trigger: card, start: 'top 88%' },
          y: 36,
          opacity: 0,
          duration: 0.65,
          delay: i * 0.06,
          ease: 'power3.out',
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [items]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] px-4 pt-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-4 h-10 w-1/2 bg-black/10 sm:w-1/3" />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 bg-black/10" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-16">
      <div className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-4xl md:text-6xl">物品展示</h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed opacity-60">
            每一件物品都承载着一段记忆，它们是客栈故事的无声讲述者。
          </p>
        </div>
      </div>

      <div ref={gridRef} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <div key={item.id} className="item-card group overflow-hidden border-2 border-black bg-white transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
              <div className="aspect-square overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#EBE5DB]">
                    <BookOpen className="h-16 w-16 opacity-20" />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-heading mb-2 text-lg transition-colors group-hover:text-[#C52A32]">{item.name}</h3>
                {item.date && (
                  <div className="mb-2 flex items-center gap-1 font-ui text-xs opacity-40">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </div>
                )}
                {item.description && <p className="line-clamp-3 font-body text-sm leading-relaxed opacity-60">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
