import { useEffect, useRef } from 'react';
import { trpc } from '@/providers/trpc';
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
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [people]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] pt-24 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-12 bg-black/10 w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-black/10" />
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
          <h1 className="font-heading text-4xl md:text-6xl mb-4">人员介绍</h1>
          <p className="font-body text-base opacity-60 max-w-xl">
            认识猫驼旅者客栈的每一位伙伴，他们让这里充满温度与故事。
          </p>
        </div>
      </div>

      {/* People Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people?.map((person) => (
            <div
              key={person.id}
              className="people-card border-2 border-black bg-white overflow-hidden hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-300 group"
            >
              {/* Avatar */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {person.avatar ? (
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#EBE5DB] flex items-center justify-center">
                    <User className="w-16 h-16 opacity-20" />
                  </div>
                )}
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                  <h3 className="font-heading text-xl">{person.name}</h3>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                {person.bio && (
                  <p className="font-body text-sm leading-relaxed opacity-70 mb-4 line-clamp-3">
                    {person.bio}
                  </p>
                )}

                {person.skills && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs font-ui opacity-50 mb-2">
                      <Star className="w-3 h-3" />
                      技能
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {person.skills.split(',').map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#F6C347] border border-black text-xs font-ui"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {person.contact && (
                  <div className="flex items-center gap-2 text-sm font-ui opacity-50 mt-4 pt-3 border-t border-black/10">
                    <Mail className="w-4 h-4" />
                    {person.contact}
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
