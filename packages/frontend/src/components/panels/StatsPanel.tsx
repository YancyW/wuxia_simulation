import type { Character } from '@life-restart/shared';
import { STAT_NAMES, MARTIAL_LEVEL_LABELS, getSect } from '@life-restart/shared';
import StatBar from '../common/StatBar';

interface StatsPanelProps {
  character: Character;
}

const STAT_COLORS = {
  bone: 'bg-amber-500',
  wits: 'bg-blue-400',
  qi: 'bg-purple-400',
  technique: 'bg-red-400',
  agility: 'bg-green-400',
  reputation: 'bg-yellow-400',
  honor: 'bg-jianghu-gold',
  constitution: 'bg-teal-400',
} as const;

export default function StatsPanel({ character }: StatsPanelProps) {
  const honorColor = character.honor > 0 ? 'bg-blue-400' : character.honor < 0 ? 'bg-red-400' : 'bg-gray-400';
  const sectName = character.sectId ? (getSect(character.sectId)?.name || character.sectId) : null;

  return (
    <div className="panel">
      <div className="text-center mb-3">
        <h2 className="text-xl font-serif text-jianghu-gold">{character.name}</h2>
        <p className="text-jianghu-ink/50 text-sm">
          {MARTIAL_LEVEL_LABELS[character.martialLevel]}
        </p>
        {sectName && (
          <p className="text-jianghu-jade text-sm mt-1">{sectName}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <StatBar label={STAT_NAMES.bone} value={character.bone} color={STAT_COLORS.bone} />
        <StatBar label={STAT_NAMES.wits} value={character.wits} color={STAT_COLORS.wits} />
        <StatBar label={STAT_NAMES.qi} value={character.qi} color={STAT_COLORS.qi} />
        <StatBar label={STAT_NAMES.technique} value={character.technique} color={STAT_COLORS.technique} />
        <StatBar label={STAT_NAMES.agility} value={character.agility} color={STAT_COLORS.agility} />
        <StatBar label={STAT_NAMES.reputation} value={character.reputation} max={30} color={STAT_COLORS.reputation} />
        <StatBar label={STAT_NAMES.honor} value={character.honor} max={100} color={honorColor} />
        <StatBar label={STAT_NAMES.constitution} value={character.constitution} color={STAT_COLORS.constitution} />
      </div>
    </div>
  );
}
