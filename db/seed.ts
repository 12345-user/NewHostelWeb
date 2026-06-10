import { getDb } from "../api/queries/connection.js";
import * as schema from "./schema.js";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed activities
  await db.insert(schema.activities).values([
    {
      title: "周末篝火故事会",
      date: "2026-03-15",
      participants: "小雨, 阿杰, Lucy, 老王",
      summary: "星空下的温暖相聚，分享旅途中的奇遇与感动",
      description: "这个周末，我们在客栈后院点燃了篝火，邀请了来自不同城市的旅人围坐在一起。大家分享了自己最难忘的旅行故事：有人讲述在西藏遇到的虔诚朝圣者，有人分享了在东南亚小岛上的日出。夜空中繁星点点，火光映照在每一张笑脸上，这一刻，陌生人之间的距离被故事拉近了。",
      images: JSON.stringify(["/images/activity-2.jpg"]),
    },
    {
      title: "手工陶艺体验日",
      date: "2026-03-22",
      participants: "客栈全体住客",
      summary: "用双手触摸泥土的温度，感受传统工艺的魅力",
      description: "我们邀请了当地的手工艺人来到客栈，教大家制作属于自己的陶器。从拉坯到塑形，每一个环节都充满了乐趣。许多住客是第一次接触陶艺，但都很快沉浸其中。泥土在指尖旋转，一点点变成杯子、盘子，甚至是小雕塑。最后大家给自己的作品上色，等待烧制完成的那一天。",
      images: JSON.stringify(["/images/activity-3.jpg"]),
    },
    {
      title: "欧洲小镇骑行之旅",
      date: "2026-04-05",
      participants: "阿杰, Lucy, 小明",
      summary: "骑上复古单车，穿梭在石板路与花丛之间",
      description: "春天的阳光正好，我们租了几辆复古自行车，沿着小镇的石板路一路骑行。路边的野花盛开，空气中弥漫着薰衣草的清香。我们在一座古老的石桥下休息，分享着带来的三明治和柠檬水。沿途遇到了热情的当地人，他们在自家的院子里挥手致意。这是一次慢节奏的旅行，却留下了最深的记忆。",
      images: JSON.stringify(["/images/activity-4.jpg"]),
    },
    {
      title: "阅读与茶话会",
      date: "2026-04-12",
      participants: "小雨, 老王, 新住客们",
      summary: "在书香与茶香中度过一个安静的午后",
      description: "客栈的图书角总是最受欢迎的角落。这个下午，我们举办了一场读书分享会。每个人都带来了一本自己最喜欢的书，朗读了其中最打动自己的段落。有人分享了《在路上》的自由与狂野，有人朗读了三毛的撒哈拉故事。茶香袅袅，文字在空气中流淌，这个下午仿佛时间静止了。",
      images: JSON.stringify(["/images/activity-1.jpg"]),
    },
  ]);

  // Seed people
  await db.insert(schema.people).values([
    {
      name: "小雨",
      bio: "客栈创始人之一，热爱旅行与摄影，曾在世界各地旅居三年。性格开朗，善于倾听，总能在深夜为旅人泡上一杯暖茶。",
      skills: "摄影, 茶艺, 手绘地图",
      contact: "xiaoyu@catcamel.com",
      avatar: "/images/person-1.jpg",
      images: JSON.stringify(["/images/person-1.jpg"]),
    },
    {
      name: "老王",
      bio: "客栈的大厨，也是所有人的「家长」。曾在米其林餐厅工作十年，却选择回归简单的生活，用一锅热汤温暖每一位过客。",
      skills: "烹饪, 烘焙, 园艺",
      contact: "laowang@catcamel.com",
      avatar: "/images/person-2.jpg",
      images: JSON.stringify(["/images/person-2.jpg"]),
    },
    {
      name: "阿杰",
      bio: "独立音乐人，背着吉他走遍了半个中国。在客栈驻唱已有两年，他的歌声里藏着山川湖海的故事。",
      skills: "吉他, 作曲, 讲故事",
      contact: "ajie@catcamel.com",
      avatar: "/images/person-3.jpg",
      images: JSON.stringify(["/images/person-3.jpg"]),
    },
  ]);

  // Seed items
  await db.insert(schema.items).values([
    {
      name: "复古旅行背包",
      date: "2026-01-10",
      description: "这个来自1970年代的皮质背包见证过无数旅程。它曾陪伴一位作家走过丝绸之路，现在安静地挂在客栈的门厅，等待下一个故事。",
      image: "/images/item-1.jpg",
    },
    {
      name: "手工陶艺杯具",
      date: "2026-02-20",
      description: "客栈陶艺体验日的作品合集。每一个杯子都独一无二，承载着创作者当时的心情与故事。它们是客栈最温暖的纪念品。",
      image: "/images/item-2.jpg",
    },
    {
      name: "旅者留言笔记本",
      date: "2026-03-01",
      description: "放在图书角的留言本，已经有三本写满了来自世界各地旅人的留言。有人画了插画，有人贴了车票，有人留下了诗句。这是一本流动的故事集。",
      image: "/images/item-3.jpg",
    },
  ]);

  console.log("Done.");
  process.exit(0);
}

seed();
