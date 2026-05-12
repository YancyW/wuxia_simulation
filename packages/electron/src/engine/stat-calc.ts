import type { Stats } from '@life-restart/shared';

export function applyEffects(current: Record<string, number>, effects: Partial<Stats>): Record<string, number> {
  const result = { ...current };
  for (const [key, val] of Object.entries(effects)) {
    result[key] = Math.max(0, Math.min(100, (result[key] ?? 0) + val));
  }
  result.honor = Math.max(-100, Math.min(100, result.honor ?? 0));
  return result;
}

export function clampStat(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
