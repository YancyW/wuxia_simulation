import { useGameStore } from '../stores/gameStore';
import StatsPanel from '../components/panels/StatsPanel';
import MartialPanel from '../components/panels/MartialPanel';
import RelationshipPanel from '../components/panels/RelationshipPanel';
import EventCard from '../components/cards/EventCard';
import OutcomeCard from '../components/cards/OutcomeCard';
import { LIFE_STAGE_LABELS } from '@life-restart/shared';

export default function GameView() {
  const character = useGameStore((s) => s.character);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const lastChoiceResult = useGameStore((s) => s.lastChoiceResult);
  const loading = useGameStore((s) => s.loading);
  const learnedArts = useGameStore((s) => s.learnedArts);
  const relations = useGameStore((s) => s.relations);
  const advanceTurn = useGameStore((s) => s.advanceTurn);
  const choose = useGameStore((s) => s.choose);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-jianghu-ink/50">加载中...</p>
      </div>
    );
  }

  const handleChoice = async (index: number) => {
    await choose(index);
  };

  const handleContinue = async () => {
    await advanceTurn();
  };

  type StatEntry = [string, number];
  const statEffects: StatEntry[] = lastChoiceResult?.choice?.effects
    ? Object.entries(lastChoiceResult.choice.effects).filter(([, v]) => v !== 0) as StatEntry[]
    : [];

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left panel - stats */}
      <div className="w-60 shrink-0 overflow-y-auto">
        <StatsPanel character={character} />
      </div>

      {/* Center - event area */}
      <div className="flex-1 flex items-center justify-center">
        {lastChoiceResult ? (
          <OutcomeCard
            choiceText={lastChoiceResult.choice.text}
            outcomeText={lastChoiceResult.outcomeText}
            effects={Object.fromEntries(statEffects)}
            onContinue={handleContinue}
          />
        ) : currentEvent ? (
          <EventCard
            event={currentEvent}
            onChoose={handleChoice}
            disabled={loading}
          />
        ) : (
          <div className="text-center">
            <p className="text-jianghu-ink/50 mb-4">暂无事件</p>
            <button className="btn-primary" onClick={handleContinue}>
              继续前行
            </button>
          </div>
        )}
      </div>

      {/* Right panel - stage, martial arts, flags */}
      <div className="w-52 shrink-0 flex flex-col gap-3 overflow-y-auto">
        <div className="panel text-center">
          <p className="text-jianghu-ink/40 text-sm">当前阶段</p>
          <p className="text-jianghu-gold font-serif text-lg">{LIFE_STAGE_LABELS[character.lifeStage]}</p>
          <p className="text-jianghu-ink/60 text-sm">年龄: {character.age}岁</p>
          {character.sectId && (
            <p className="text-jianghu-jade text-sm mt-1">门派: {character.sectId}</p>
          )}
          {character.flags.filter((f: string) => f.startsWith('dungeon_') && f.endsWith('_active')).map((f: string) => {
            const dungId = f.replace(/^dungeon_/, '').replace(/_active$/, '');
            const doneStages = character.flags.filter((ff: string) => ff.startsWith(`dungeon_${dungId}_stage_`) && ff.endsWith('_done')).length;
            return (
              <p key={f} className="text-jianghu-gold text-xs mt-1 animate-pulse">
                副本进行中 ({doneStages + 1}/?)
              </p>
            );
          })}
        </div>

        <MartialPanel arts={learnedArts} />

        <RelationshipPanel relations={relations} />

        {character.flags.length > 0 && (
          <div className="panel">
            <p className="text-jianghu-ink/40 text-sm mb-2">经历</p>
            <div className="flex flex-wrap gap-1">
              {character.flags.map((f) => (
                <span key={f} className="text-xs text-jianghu-ink/50 bg-jianghu-bg px-1.5 py-0.5 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
