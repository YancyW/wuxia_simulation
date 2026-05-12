import type { MartialArt } from '../types/martial-art';

export const MARTIAL_ARTS: MartialArt[] = [
  // 内功
  { id: 'yijinjing', name: '易筋经', type: 'internal', description: '少林镇寺之宝，洗髓易筋，脱胎换骨。', rarity: 5, minBone: 6, minWits: 5, sectOnly: 'shaolin' },
  { id: 'jiuyang', name: '九阳神功', type: 'internal', description: '至阳至刚的内功心法，练成后内力源源不绝。', rarity: 4, minBone: 5, minQi: 3 },
  { id: 'xiaowuxiang', name: '小无相功', type: 'internal', description: '逍遥派内功，不着形相，无迹可寻。', rarity: 3, minWits: 6, sectOnly: 'xiaoyao' },
  { id: 'zixia', name: '紫霞神功', type: 'internal', description: '华山派上乘内功，紫气东来，霞光万道。', rarity: 3, minBone: 4, minQi: 4, sectOnly: 'huashan' },
  { id: 'xixingdafa', name: '吸星大法', type: 'internal', description: '日月神教秘传，可吸人内力为己用，霸道异常。', rarity: 4, sectOnly: 'riyue', honorRequired: { max: 0 } },

  // 拳掌
  { id: 'xianglong18', name: '降龙十八掌', type: 'palm', description: '丐帮绝学，刚猛凌厉，天下第一掌法。', rarity: 5, minBone: 6, minQi: 5, sectOnly: 'gaibang' },
  { id: 'taijiquan', name: '太极拳', type: 'palm', description: '武当张三丰所创，以柔克刚，四两拨千斤。', rarity: 4, minWits: 5, sectOnly: 'wudang' },
  { id: 'qishangquan', name: '七伤拳', type: 'palm', description: '伤人先伤己的霸道拳法，一拳七伤。', rarity: 3, minBone: 4 },
  { id: 'tiezhang', name: '铁掌', type: 'palm', description: '铁掌帮绝学，一双肉掌练得坚如钢铁。', rarity: 2, minBone: 3 },

  // 剑法
  { id: 'dugu9jian', name: '独孤九剑', type: 'sword', description: '剑魔独孤求败所创，破尽天下武功。', rarity: 5, minWits: 7, minTechnique: 5 },
  { id: 'taijijian', name: '太极剑法', type: 'sword', description: '武当剑法，圆转如意，借力打力。', rarity: 4, minWits: 5, sectOnly: 'wudang' },
  { id: 'huashanjian', name: '华山剑法', type: 'sword', description: '华山派基础剑法，凌厉如风。', rarity: 2, minTechnique: 2, sectOnly: 'huashan' },
  { id: 'emeijian', name: '峨眉剑法', type: 'sword', description: '峨眉派剑法，轻灵飘逸，暗藏杀机。', rarity: 3, sectOnly: 'emei', genderRequired: 'female' },
  { id: 'bixiejian', name: '辟邪剑法', type: 'sword', description: '诡异无比的剑法，快如鬼魅，但代价极大。', rarity: 4, sectOnly: 'riyue', honorRequired: { max: -30 } },

  // 刀法
  { id: 'hujiadaofa', name: '胡家刀法', type: 'blade', description: '胡家祖传刀法，招招取人要害，凌厉无匹。', rarity: 3, minBone: 3, minTechnique: 3 },
  { id: 'xuedaodafa', name: '血刀大法', type: 'blade', description: '血刀门邪功，刀出见血，狠辣异常。', rarity: 3, honorRequired: { max: 0 } },
  { id: 'jinwudao', name: '金乌刀法', type: 'blade', description: '至阳刀法，出刀如烈日当空，势不可挡。', rarity: 2, minQi: 3 },

  // 轻功
  { id: 'lingboweibu', name: '凌波微步', type: 'movement', description: '逍遥派绝学，步法精妙，如踏水而行。', rarity: 4, minWits: 6, sectOnly: 'xiaoyao' },
  { id: 'tiyunzong', name: '梯云纵', type: 'movement', description: '武当轻功，纵跃如飞，攀崖如履平地。', rarity: 3, minAgility: 4, sectOnly: 'wudang' },
  { id: 'shenxingbaibian', name: '神行百变', type: 'movement', description: '变幻莫测的轻功步法，身法快如闪电。', rarity: 3, minAgility: 4 },

  // 奇门
  { id: 'dagougb', name: '打狗棒法', type: 'special', description: '丐帮帮主信物武功，三十六路打狗棒法。', rarity: 4, minWits: 4, sectOnly: 'gaibang' },
  { id: 'liumaishenjian', name: '六脉神剑', type: 'special', description: '大理段氏绝学，以指力激发无形剑气。', rarity: 5, minQi: 7, minWits: 5 },
  { id: 'tanzhishentong', name: '弹指神通', type: 'special', description: '桃花岛绝技，弹指间可取人性命。', rarity: 3, minWits: 4, minTechnique: 4 },
  { id: 'shigong', name: '狮吼功', type: 'special', description: '以声伤人，一吼震山河，群敌丧胆。', rarity: 2, minQi: 3 },
  { id: 'jiuyinbgz', name: '九阴白骨爪', type: 'special', description: '九阴真经中的阴毒武功，五指穿石。', rarity: 3, sectOnly: 'emei', genderRequired: 'female' },
  { id: 'kuihua', name: '葵花宝典', type: 'special', description: '武林第一奇功，练成后天下无敌，但代价是……', rarity: 5, sectOnly: 'riyue', honorRequired: { max: -50 } },
];

export function getMartialArt(id: string): MartialArt | undefined {
  return MARTIAL_ARTS.find((a) => a.id === id);
}
