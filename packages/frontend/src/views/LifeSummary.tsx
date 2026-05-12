import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { MARTIAL_LEVEL_LABELS, LIFE_STAGE_LABELS } from '@life-restart/shared';

export default function LifeSummary() {
  const character = useGameStore((s) => s.character);
  const deathCause = useGameStore((s) => s.deathCause);
  const reset = useGameStore((s) => s.reset);
  const setView = useUiStore((s) => s.setView);
  const learnedArts = useGameStore((s) => s.learnedArts);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-jianghu-ink/50">没有存档</p>
      </div>
    );
  }

  const getEndingTitle = (): string => {
    const { honor, reputation, martialLevel } = character;
    if (honor > 60 && reputation >= 10) return '武林盟主';
    if (honor > 60) return '一代大侠';
    if (honor < -60 && reputation >= 10) return '魔教教主';
    if (honor < -60) return '身败名裂';
    if (martialLevel === 'grandmaster' || martialLevel === 'supreme') return '一代宗师';
    if (reputation >= 15) return '江湖传说';
    return '归隐高人';
  };

  const handleReturn = () => {
    reset();
    setView('menu');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 overflow-y-auto py-8">
      <h1 className="text-5xl font-serif font-bold text-jianghu-gold">人生总结</h1>

      <div className="text-center">
        <p className="text-3xl font-serif text-jianghu-gold mb-2">{getEndingTitle()}</p>
        <p className="text-jianghu-ink/60">
          {character.name} · {character.gender === 'male' ? '男' : '女'} · 享年 {character.age} 岁
        </p>
        {deathCause && (
          <p className="text-jianghu-red/70 text-sm mt-2">{deathCause}</p>
        )}
      </div>

      {/* Stats summary */}
      <div className="panel max-w-md w-full">
        <h3 className="text-jianghu-gold font-serif text-lg mb-3 text-center">一生修为</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-jianghu-ink/60">武学境界</span>
            <span className="text-jianghu-gold">{MARTIAL_LEVEL_LABELS[character.martialLevel]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-jianghu-ink/60">江湖声望</span>
            <span className="text-jianghu-ink">{character.reputation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-jianghu-ink/60">侠义值</span>
            <span className={character.honor > 0 ? 'text-blue-400' : character.honor < 0 ? 'text-red-400' : 'text-gray-400'}>
              {character.honor}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-jianghu-ink/60">根骨</span>
            <span className="text-jianghu-ink">{character.bone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-jianghu-ink/60">悟性</span>
            <span className="text-jianghu-ink">{character.wits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-jianghu-ink/60">内力</span>
            <span className="text-jianghu-ink">{character.qi}</span>
          </div>
        </div>
      </div>

      {/* Learned arts */}
      {learnedArts.length > 0 && (
        <div className="panel max-w-md w-full">
          <h3 className="text-jianghu-gold font-serif text-lg mb-3 text-center">武学传承</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {learnedArts.map((art) => (
              <span key={art.id} className="px-3 py-1 border border-jianghu-gold/30 rounded text-sm text-jianghu-ink">
                {art.artId} ({art.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      <button className="btn-primary mt-4" onClick={handleReturn}>
        重返江湖
      </button>
    </div>
  );
}
