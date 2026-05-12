export type Gender = 'male' | 'female';

export type LifeStage = 'youth' | 'young_adult' | 'adult' | 'middle_age';

export type MartialLevel =
  | 'beginner'
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'master'
  | 'grandmaster'
  | 'supreme';

export interface Stats {
  bone: number;
  wits: number;
  qi: number;
  technique: number;
  agility: number;
  reputation: number;
  honor: number;
  constitution: number;
}

export type BackgroundId =
  | 'martial_family'
  | 'scholar_family'
  | 'street_orphan'
  | 'merchant_family'
  | 'noble_family';

export interface Background {
  id: BackgroundId;
  name: string;
  description: string;
  bonuses: Partial<Stats>;
}

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  lifeStage: LifeStage;
  martialLevel: MartialLevel;
  sectId: string | null;
  flags: string[];
  isAlive: boolean;
  diedAt: number | null;
  deathCause: string | null;
  createdAt: string;
  // Stats
  bone: number;
  wits: number;
  qi: number;
  technique: number;
  agility: number;
  reputation: number;
  honor: number;
  constitution: number;
}

export interface CharacterCreateInput {
  name: string;
  gender: Gender;
  backgroundId: BackgroundId;
}

export const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
  youth: '少年',
  young_adult: '青年',
  adult: '壮年',
  middle_age: '中年',
};

export const MARTIAL_LEVEL_LABELS: Record<MartialLevel, string> = {
  beginner: '初窥门径',
  novice: '略有小成',
  intermediate: '登堂入室',
  advanced: '炉火纯青',
  master: '出神入化',
  grandmaster: '一代宗师',
  supreme: '天下第一',
};
