export interface NpcTemplate {
  id: string;
  name: string;
  description: string;
  possibleRelations: string[];
}

export const NPC_TEMPLATES: NpcTemplate[] = [
  { id: 'old_master', name: '白发老翁', description: '一位须发皆白的神秘老人，武功深不可测。', possibleRelations: ['master'] },
  { id: 'sword_beauty', name: '剑中仙子', description: '仗剑江湖的绝色女子，剑法如人一般飘逸。', possibleRelations: ['partner', 'friend', 'rival'] },
  { id: 'wandering_hero', name: '游侠浪子', description: '四海为家的江湖浪子，豪爽仗义。', possibleRelations: ['friend', 'rival'] },
  { id: 'dark_lord', name: '魔教高手', description: '神秘组织的高手，武功诡谲，心狠手辣。', possibleRelations: ['rival'] },
  { id: 'young_prodigy', name: '少年奇才', description: '天赋异禀的少年，对武学有极高的热情。', possibleRelations: ['disciple', 'friend'] },
  { id: 'monk_master', name: '高僧大德', description: '得道高僧，佛法精深，武功卓绝。', possibleRelations: ['master', 'friend'] },
  { id: 'hermit_elder', name: '隐世前辈', description: '隐居深山的前辈高人，不谙世事但武功盖世。', possibleRelations: ['master'] },
];
