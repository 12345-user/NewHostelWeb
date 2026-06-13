import { useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc-client';
import { Mail, Star, User } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function People() {
  const { data: people, isLoading } = trpc.people.list.useQuery();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!people) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.people-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%' },
          y: 36,
          opacity: 0,
          duration: 0.65,
          delay: i * 0.08,
          ease: 'power3.out',
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [people]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] px-4 pt-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-4 h-10 w-1/2 bg-black/10 sm:w-1/3" />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-black/10" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-16">
      <div className="border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-4xl md:text-6xl">人员介绍</h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed opacity-60">
            认识猫驼旅者客栈的伙伴，他们让这里充满温度与故事。
          </p>
        </div>
      </div>

      <div ref={gridRef} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {people?.map((person) => (
            <div key={person.id} className="people-card group overflow-hidden border-2 border-black bg-white transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                {person.avatar ? (
                  <img src={person.avatar} alt={person.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'sepia(0.15) contrast(1.05)' }} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#EBE5DB]">
                    <User className="h-16 w-16 opacity-20" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                  <h3 className="font-heading text-xl">{person.name}</h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {person.bio && <p className="mb-4 line-clamp-3 font-body text-sm leading-relaxed opacity-70">{person.bio}</p>}

                {person.skills && (
                  <div className="mb-3">
                    <div className="mb-2 flex items-center gap-1 font-ui text-xs opacity-50">
                      <Star className="h-3 w-3" />
                      技能
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {person.skills.split(',').map((skill, i) => (
                        <span key={i} className="border border-black bg-[#F6C347] px-2 py-1 font-ui text-xs">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {person.contact && (
                  <div className="mt-4 flex min-w-0 items-center gap-2 border-t border-black/10 pt-3 font-ui text-sm opacity-50">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{person.contact}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
