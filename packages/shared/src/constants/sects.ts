import type { Sect } from '../types/sect';

export const SECTS: Sect[] = [
  {
    id: 'shaolin',
    name: '少林',
    description: '佛门正宗，以深厚内功和七十二绝技闻名天下。',
    conditionHonorMin: 0,
    exclusiveArts: ['yijinjing', 'shaolin72'],
  },
  {
    id: 'wudang',
    name: '武当',
    description: '道家太极，以柔克刚，四两拨千斤。',
    conditionWitsMin: 5,
    exclusiveArts: ['taijiquan', 'taijijian', 'tiyunzong'],
  },
  {
    id: 'gaibang',
    name: '丐帮',
    description: '天下第一大帮，弟子遍布江湖。',
    exclusiveArts: ['xianglong18', 'dagougb'],
  },
  {
    id: 'huashan',
    name: '华山',
    description: '五岳剑派之一，剑法独步天下。',
    conditionTechniqueMin: 4,
    exclusiveArts: ['dugu9jian', 'zixia'],
  },
  {
    id: 'emei',
    name: '峨眉',
    description: '女子剑派，剑法轻灵飘逸，暗藏杀机。',
    conditionGender: 'female',
    exclusiveArts: ['emeijian', 'jiuyinbgz'],
  },
  {
    id: 'xiaoyao',
    name: '逍遥',
    description: '隐世奇门，武功飘逸出尘，讲究逍遥自在。',
    exclusiveArts: ['xiaowuxiang', 'lingboweibu'],
  },
  {
    id: 'riyue',
    name: '日月神教',
    description: '亦正亦邪，武功霸道诡异，为达目的不择手段。',
    conditionHonorMax: 0,
    exclusiveArts: ['xixingdafa', 'kuihua'],
  },
  {
    id: 'wandering',
    name: '散修',
    description: '无门无派，随心所欲，一切靠机缘。',
    exclusiveArts: [],
  },
];

export function getSect(id: string): Sect | undefined {
  return SECTS.find((s) => s.id === id);
}
