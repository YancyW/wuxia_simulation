import type { MartialLevel } from '../types/character';

export interface MartialLevelDef {
  level: MartialLevel;
  name: string;
  minTotalStats: number;
}

export const MARTIAL_LEVELS: MartialLevelDef[] = [
  { level: 'beginner', name: '初窥门径', minTotalStats: 0 },
  { level: 'novice', name: '略有小成', minTotalStats: 8 },
  { level: 'intermediate', name: '登堂入室', minTotalStats: 16 },
  { level: 'advanced', name: '炉火纯青', minTotalStats: 26 },
  { level: 'master', name: '出神入化', minTotalStats: 36 },
  { level: 'grandmaster', name: '一代宗师', minTotalStats: 48 },
  { level: 'supreme', name: '天下第一', minTotalStats: 60 },
];

export function getMartialLevel(totalStats: number): MartialLevel {
  let result: MartialLevel = 'beginner';
  for (const def of MARTIAL_LEVELS) {
    if (totalStats >= def.minTotalStats) {
      result = def.level;
    }
  }
  return result;
}
