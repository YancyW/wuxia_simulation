import type { LifeStage } from '../types/character';

export interface LifeStageDef {
  stage: LifeStage;
  name: string;
  ageMin: number;
  ageMax: number;
}

export const LIFE_STAGES: LifeStageDef[] = [
  { stage: 'youth', name: '少年', ageMin: 10, ageMax: 16 },
  { stage: 'young_adult', name: '青年', ageMin: 17, ageMax: 30 },
  { stage: 'adult', name: '壮年', ageMin: 31, ageMax: 45 },
  { stage: 'middle_age', name: '中年', ageMin: 46, ageMax: 60 },
];

export const DEATH_AGE_MIN = 46;
export const DEATH_AGE_MAX = 80;

export function getLifeStage(age: number): LifeStage | 'dead' {
  if (age > DEATH_AGE_MAX) return 'dead';
  for (const def of LIFE_STAGES) {
    if (age >= def.ageMin && age <= def.ageMax) return def.stage;
  }
  return 'middle_age';
}

export function getStageAgeIncrement(stage: LifeStage): number {
  switch (stage) {
    case 'youth': return 1;
    case 'young_adult': return 1;
    case 'adult': return 1;
    case 'middle_age': return 1;
  }
}
