const now = new Date("2026-06-08T00:00:00.000Z");

export const demoActivities = [
  {
    id: 1,
    title: "周末篝火故事会",
    date: "2026-03-15",
    participants: "小雨, 阿杰, Lucy, 老王",
    summary: "星空下的温暖相聚，分享旅途中的奇遇与感动",
    description:
      "这个周末，我们在客栈后院点燃了篝火，邀请来自不同城市的旅人围坐在一起。大家分享旅行故事，陌生人之间的距离被火光和笑声慢慢拉近。",
    images: ["/images/activity-2.jpg"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "手工陶艺体验日",
    date: "2026-03-22",
    participants: "客栈全体住客",
    summary: "用双手触摸泥土的温度，感受传统手作的魅力",
    description:
      "我们邀请当地手工艺人来到客栈，教大家制作属于自己的陶器。从拉坯到塑形，每一个环节都充满乐趣。",
    images: ["/images/activity-3.jpg"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    title: "欧洲小镇骑行之旅",
    date: "2026-04-05",
    participants: "阿杰, Lucy, 小明",
    summary: "骑上复古单车，穿梭在石板路与花丛之间",
    description:
      "春天的阳光正好，我们租了几辆复古自行车，沿着小镇石板路慢慢骑行，在桥下分享三明治和柠檬水。",
    images: ["/images/activity-4.jpg"],
    createdAt: now,
    updatedAt: now,
  },
];

export const demoPeople = [
  {
    id: 1,
    name: "小雨",
    bio: "客栈创始人之一，热爱旅行与摄影，擅长把旅人的故事装进照片。",
    skills: "摄影, 茶艺, 手绘地图",
    contact: "xiaoyu@catcamel.com",
    avatar: "/images/person-1.jpg",
    images: ["/images/person-1.jpg"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "老王",
    bio: "客栈的大厨，也是大家的老朋友，用一锅热汤温暖每一位过客。",
    skills: "烹饪, 烘焙, 园艺",
    contact: "laowang@catcamel.com",
    avatar: "/images/person-2.jpg",
    images: ["/images/person-2.jpg"],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "阿杰",
    bio: "独立音乐人，背着吉他走过很多地方，歌声里藏着山川湖海。",
    skills: "吉他, 作曲, 讲故事",
    contact: "ajie@catcamel.com",
    avatar: "/images/person-3.jpg",
    images: ["/images/person-3.jpg"],
    createdAt: now,
    updatedAt: now,
  },
];

export const demoItems = [
  {
    id: 1,
    name: "复古旅行背包",
    date: "2026-01-10",
    description: "来自 1970 年代的皮质背包，见证过无数旅程。",
    image: "/images/item-1.jpg",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "手工陶艺杯具",
    date: "2026-02-20",
    description: "陶艺体验日留下的作品合集，每一个杯子都独一无二。",
    image: "/images/item-2.jpg",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "旅者留言笔记本",
    date: "2026-03-01",
    description: "放在图书角的留言本，写满来自各地旅人的句子。",
    image: "/images/item-3.jpg",
    createdAt: now,
    updatedAt: now,
  },
];
