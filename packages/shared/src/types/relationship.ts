export type RelationType = 'master' | 'partner' | 'friend' | 'rival' | 'disciple';

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  master: '师父',
  partner: '道侣',
  friend: '挚友',
  rival: '仇敌',
  disciple: '同门',
};

export interface Relationship {
  id: string;
  characterId: string;
  npcName: string;
  relationType: RelationType;
  affinity: number;
  description: string;
  createdAt: string;
}
