import { useState } from 'react';
import { useUiStore } from '../stores/uiStore';
import { useGameStore } from '../stores/gameStore';
import { BACKGROUNDS, STAT_NAMES } from '@life-restart/shared';

export default function CharacterCreate() {
  const setView = useUiStore((s) => s.setView);
  const createGame = useGameStore((s) => s.createGame);
  const loading = useGameStore((s) => s.loading);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [backgroundId, setBackgroundId] = useState(BACKGROUNDS[0]!.id);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('请输入姓名');
      return;
    }
    try {
      await createGame(name.trim(), gender, backgroundId);
      setView('game');
    } catch (e) {
      setError('创建失败，请重试');
    }
  };

  const selectedBg = BACKGROUNDS.find((b) => b.id === backgroundId);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      <h1 className="text-4xl font-serif font-bold text-jianghu-gold">初入江湖</h1>

      {/* Name */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-jianghu-ink/60">姓 名</label>
        <input
          className="bg-jianghu-panel border border-jianghu-gold/30 rounded px-4 py-2 text-center text-lg text-jianghu-ink
                     focus:outline-none focus:border-jianghu-gold w-48"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="请输入姓名"
          maxLength={8}
        />
      </div>

      {/* Gender */}
      <div className="flex gap-4">
        {(['male', 'female'] as const).map((g) => (
          <button
            key={g}
            className={`px-6 py-2 rounded border transition-all ${
              gender === g
                ? 'border-jianghu-gold text-jianghu-gold bg-jianghu-gold/10'
                : 'border-jianghu-ink/20 text-jianghu-ink/50 hover:border-jianghu-gold/50'
            }`}
            onClick={() => setGender(g)}
          >
            {g === 'male' ? '男' : '女'}
          </button>
        ))}
      </div>

      {/* Background */}
      <div className="flex flex-col items-center gap-3">
        <label className="text-jianghu-ink/60">出 身</label>
        <div className="grid grid-cols-1 gap-2 w-72">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              className={`text-left px-4 py-3 rounded border transition-all ${
                backgroundId === bg.id
                  ? 'border-jianghu-gold bg-jianghu-gold/10'
                  : 'border-jianghu-ink/10 hover:border-jianghu-gold/30'
              }`}
              onClick={() => setBackgroundId(bg.id)}
            >
              <div className="text-jianghu-ink font-medium">{bg.name}</div>
              <div className="text-jianghu-ink/40 text-sm">{bg.description}</div>
              {selectedBg && backgroundId === bg.id && (
                <div className="text-jianghu-jade text-xs mt-1">
                  {Object.entries(bg.bonuses)
                    .map(([k, v]) => `${STAT_NAMES[k as keyof typeof STAT_NAMES]}+${v}`)
                    .join('  ')}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-jianghu-red text-sm">{error}</p>}

      <div className="flex gap-4 mt-4">
        <button className="btn-ghost" onClick={() => setView('menu')}>返回</button>
        <button className="btn-primary w-32" onClick={handleCreate} disabled={loading}>
          {loading ? '创建中...' : '踏入江湖'}
        </button>
      </div>
    </div>
  );
}
