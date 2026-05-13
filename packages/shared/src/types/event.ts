import type { LifeStage, MartialLevel, Stats } from './character.js';

export interface StatModifier {
  stat: keyof Stats;
  value: number;
}

export interface EventChoice {
  text: string;
  outcomeText: string;
  effects: Partial<Stats>;
  setFlags?: string[];
  learnArt?: string;
  joinSect?: string;
  requiredFlags?: string[];
  excludedFlags?: string[];
  instantDeath?: boolean;
  minAffinity?: { npcId: string; value: number };
  createRelation?: {
    npcName: string;
    relationType: string;
    affinity?: number;
    description?: string;
  };
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  lifeStages: LifeStage[];
  rarity: number;
  oncePerGame?: boolean;
  conditions?: EventConditions;
  choices: EventChoice[];
}

export interface EventConditions {
  minStats?: Partial<Stats>;
  maxStats?: Partial<Stats>;
  requiredFlags?: string[];
  excludedFlags?: string[];
  requiredHonor?: { min?: number; max?: number };
  requiredMartialLevel?: MartialLevel;
  requiredSect?: string;
  requiredGender?: 'male' | 'female';
  requiredNpcRelation?: { npcId: string; minAffinity?: number };
}

export interface DungeonStage {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface DungeonReward {
  effects: Partial<Stats>;
  learnArt?: string;
  setFlags?: string[];
}

export interface DungeonTemplate {
  id: string;
  title: string;
  summary: string;
  lifeStages: LifeStage[];
  rarity: number;
  oncePerGame?: boolean;
  conditions?: EventConditions;
  stages: DungeonStage[];
  reward?: DungeonReward;
}
