import type { MartialLevel, Proficiency } from '@life-restart/shared';
import { getMartialLevel, proficiencyFromValue } from '@life-restart/shared';

export function calculateMartialLevel(bone: number, wits: number, qi: number, technique: number): MartialLevel {
  return getMartialLevel(bone + wits + qi + technique);
}

export function calculateProficiency(proficiencyValue: number): Proficiency {
  return proficiencyFromValue(proficiencyValue);
}
