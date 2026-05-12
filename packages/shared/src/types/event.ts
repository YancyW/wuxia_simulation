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
  conditions?: {
    minStats?: Partial<Stats>;
    maxStats?: Partial<Stats>;
    requiredFlags?: string[];
    excludedFlags?: string[];
    requiredHonor?: { min?: number; max?: number };
    requiredMartialLevel?: MartialLevel;
    requiredSect?: string;
    requiredGender?: 'male' | 'female';
  };
  choices: EventChoice[];
}
