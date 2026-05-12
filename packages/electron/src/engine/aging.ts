import type { LifeStage } from '@life-restart/shared';
import { getLifeStage, DEATH_AGE_MIN, DEATH_AGE_MAX } from '@life-restart/shared';

export interface AgingResult {
  newAge: number;
  newLifeStage: LifeStage | 'dead';
  died: boolean;
  deathCause: string | null;
}

export function advanceAge(
  currentAge: number,
  constitution: number,
): AgingResult {
  const newAge = currentAge + 1;

  const deathChance = calculateDeathChance(newAge, constitution);
  if (Math.random() < deathChance) {
    const stage = getLifeStage(newAge);
    const causes = stage === 'dead'
      ? ['寿终正寝，安然离世。']
      : getDeathCauses(newAge, constitution);
    return {
      newAge,
      newLifeStage: 'dead',
      died: true,
      deathCause: causes[Math.floor(Math.random() * causes.length)] || '寿终正寝。',
    };
  }

  const newLifeStage = getLifeStage(newAge);
  return { newAge, newLifeStage: newLifeStage === 'dead' ? 'middle_age' : newLifeStage, died: false, deathCause: null };
}

function calculateDeathChance(age: number, constitution: number): number {
  if (age < DEATH_AGE_MIN) return 0;

  const ageFactor = (age - DEATH_AGE_MIN) / (DEATH_AGE_MAX - DEATH_AGE_MIN);
  const constitutionPenalty = (10 - constitution) * 0.04;

  return Math.max(0, Math.min(1, ageFactor * 0.3 + constitutionPenalty));
}

function getDeathCauses(age: number, constitution: number): string[] {
  const causes: string[] = [];

  if (constitution <= 3) {
    causes.push('积劳成疾，旧伤复发，不幸离世。');
    causes.push('多年征战落下的病根终于爆发，撒手人寰。');
  }
  if (age >= 50) {
    causes.push('寿元已尽，在睡梦中安详离世。');
  }
  causes.push('在一次战斗中受重伤不治身亡。');
  causes.push('走火入魔，经脉尽断而亡。');
  causes.push('为奸人所害，含恨而终。');

  return causes;
}
