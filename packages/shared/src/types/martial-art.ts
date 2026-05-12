export type ArtType = 'internal' | 'palm' | 'sword' | 'blade' | 'movement' | 'special';

export type Proficiency = 'beginner' | 'skilled' | 'expert' | 'mastered';

export const ART_TYPE_LABELS: Record<ArtType, string> = {
  internal: '内功',
  palm: '拳掌',
  sword: '剑法',
  blade: '刀法',
  movement: '轻功',
  special: '奇门',
};

export const PROFICIENCY_LABELS: Record<Proficiency, string> = {
  beginner: '初学',
  skilled: '熟练',
  expert: '精通',
  mastered: '化境',
};

export interface MartialArt {
  id: string;
  name: string;
  type: ArtType;
  description: string;
  rarity: number;
  minBone?: number;
  minWits?: number;
  minQi?: number;
  minTechnique?: number;
  minAgility?: number;
  sectOnly?: string;
  honorRequired?: { min?: number; max?: number };
  genderRequired?: 'male' | 'female';
}

export interface LearnedMartialArt {
  id: string;
  characterId: string;
  artId: string;
  proficiency: Proficiency;
  proficiencyValue: number;
  learnedAt: string;
}

export function proficiencyFromValue(value: number): Proficiency {
  if (value >= 76) return 'mastered';
  if (value >= 51) return 'expert';
  if (value >= 26) return 'skilled';
  return 'beginner';
}

export function martialLevelFromStats(stats: { bone: number; wits: number; qi: number; technique: number }): number {
  return stats.bone + stats.wits + stats.qi + stats.technique;
}
