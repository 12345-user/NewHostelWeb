import { Link } from 'react-router';
import { ArrowLeft, CalendarClock, Home, Mail, MapPin, MessageCircle, Moon, Phone, Sparkles, Users } from 'lucide-react';

const highlights = [
  {
    title: '慢下来住几天',
    text: '院落、茶桌和公共空间都适合发呆、聊天、整理旅途照片。',
    icon: Moon,
    className: 'bg-[#F7F0E6]',
    iconClassName: 'bg-[#D7B861]',
  },
  {
    title: '旅人故事聚场',
    text: '客栈会记录活动、物件和伙伴，让每次停留都能留下线索。',
    icon: Sparkles,
    className: 'bg-[#F1D9D4]',
    iconClassName: 'bg-[#A95A50] text-white',
  },
  {
    title: '古城步行友好',
    text: '适合轻装到店、慢逛古城，也方便安排周边短途旅行。',
    icon: MapPin,
    className: 'bg-[#DCE7D5]',
    iconClassName: 'bg-[#8FA783]',
  },
];

const infoCards = [
  {
    label: '地址',
    value: '云南省大理市古城内',
    note: '具体门牌和到店路线可在确认预订后发送',
    icon: MapPin,
    className: 'bg-[#E1C669] text-[#20160C]',
    iconClassName: 'bg-[#FFF7DF] text-[#A95A50]',
  },
  {
    label: '入住 / 退房',
    value: '14:00 后入住 / 12:00 前退房',
    note: '如需提前寄存行李，可以提前联系确认',
    icon: CalendarClock,
    className: 'bg-[#8EB9BA] text-[#102021]',
    iconClassName: 'bg-[#F4FBFA] text-[#477F82]',
  },
  {
    label: '联系方式',
    value: 'hello@catcamel.com',
    note: '后续可替换成你的手机号、微信或预订平台链接',
    icon: Mail,
    className: 'bg-[#F7F0E6] text-black',
    iconClassName: 'bg-[#A95A50] text-white',
  },
  {
    label: '适合人群',
    value: '独行旅人、朋友小住、轻旅行博主',
    note: '适合愿意慢慢体验空间和在地故事的客人',
    icon: Users,
    className: 'bg-[#8FA783] text-[#141D12]',
    iconClassName: 'bg-[#F6F8EE] text-[#687B59]',
  },
];

export default function AboutDetail() {
  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-16">
      <section className="border-b-2 border-black bg-[#E6D8C6]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-8 sm:gap-10">
            <div>
              <Link
                to="/"
                className="mb-6 inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-ui text-sm tracking-wide transition-all hover:bg-black hover:text-white sm:mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Link>
              <div className="mb-5 inline-flex border-2 border-black bg-[#D7B861] px-4 py-1 font-ui text-xs uppercase tracking-widest">
                关于客栈
              </div>
              <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">
                猫驼旅者客栈
              </h1>
              <p className="mt-5 max-w-xl font-body text-base leading-relaxed opacity-75 sm:text-lg">
                一个给旅人短暂停靠、交换故事、重新出发的小院。这里不急着把行程塞满，更在意你是否能睡个好觉、喝杯热茶、遇见一点刚刚好的松弛。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t-2 border-black pt-5">
              <div className="border-2 border-black bg-[#F7F0E6] p-4">
                <div className="font-display text-4xl">2024</div>
                <div className="font-ui text-xs tracking-widest opacity-60">开始营业</div>
              </div>
              <div className="border-2 border-black bg-[#8EB9BA] p-4 text-[#102021]">
                <div className="font-display text-4xl">24h</div>
                <div className="font-ui text-xs tracking-widest opacity-60">线上留言</div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden border-2 border-black bg-black sm:min-h-[420px]">
            <img
              src="/images/hero-2.jpg"
              alt="猫驼旅者客栈院落"
              className="h-full w-full object-cover"
              style={{ filter: 'sepia(0.12) contrast(1.05)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 border-t-2 border-black bg-[#A95A50]/94 p-4 text-white backdrop-blur-sm sm:p-5">
              <div className="flex items-start gap-3 font-ui text-sm leading-relaxed">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-[#F4D275]" />
                <span>大理古城里的旅人小院 / 适合慢住与轻旅行</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-dashed border-black bg-[#EFE6D8] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 border-b-2 border-black pb-3 sm:mb-8">
            <h2 className="font-heading text-3xl md:text-4xl">到店信息</h2>
            <p className="mt-1 font-body text-sm opacity-60">把客人最需要确认的内容集中放在这里</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {infoCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className={`min-h-[152px] border-2 border-black p-4 sm:min-h-[166px] sm:p-5 ${card.className}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-ui text-xs tracking-widest opacity-55">{card.label}</div>
                      <h3 className="mt-2 break-words font-heading text-xl leading-snug">{card.value}</h3>
                    </div>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black sm:h-11 sm:w-11 ${card.iconClassName}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 font-body text-sm leading-relaxed opacity-65 sm:mt-5">{card.note}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div>
            <div className="lg:sticky lg:top-24">
              <div className="mb-5 inline-flex border-2 border-black px-4 py-1 font-ui text-xs tracking-widest">
                住在这里
              </div>
              <h2 className="font-heading text-3xl leading-tight md:text-4xl">不是标准酒店说明书，而是一份到店前的心理预期。</h2>
              <div className="mt-6 overflow-hidden border-2 border-black sm:mt-8">
                <img
                  src="/images/hero-3.jpg"
                  alt="客栈公共空间"
                  className="aspect-[4/3] w-full object-cover"
                  style={{ filter: 'sepia(0.16) contrast(1.05)' }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className={`grid grid-cols-[auto_1fr] gap-4 border-2 border-black p-4 sm:gap-5 sm:p-5 ${item.className}`}>
                  <div className={`flex h-11 w-11 items-center justify-center border-2 border-black sm:h-12 sm:w-12 ${item.iconClassName}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-ui text-xs tracking-widest opacity-45">0{index + 1}</div>
                    <h3 className="mt-1 font-heading text-xl">{item.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed opacity-65">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t-2 border-black px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-2 border-black bg-[#2F3F3C] p-5 text-white sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-ui text-xs tracking-widest opacity-75">CONTACT</div>
            <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl">准备来住之前，先确认一下细节。</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex">
            <a href="mailto:hello@catcamel.com" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-white px-4 py-3 font-ui text-sm tracking-wide transition-all hover:bg-white hover:text-[#2F3F3C]">
              <Mail className="h-4 w-4" />
              邮件联系
            </a>
            <a href="tel:13800000000" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#D7B861] bg-[#D7B861] px-4 py-3 font-ui text-sm tracking-wide text-black transition-all hover:bg-transparent hover:text-white">
              <Phone className="h-4 w-4" />
              电话咨询
            </a>
            <Link to="/activities" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-white px-4 py-3 font-ui text-sm tracking-wide transition-all hover:bg-white hover:text-[#2F3F3C]">
              <MessageCircle className="h-4 w-4" />
              先看活动
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
