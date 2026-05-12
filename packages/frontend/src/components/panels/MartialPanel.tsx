import type { LearnedArt } from '../../global';
import { MARTIAL_ARTS, ART_TYPE_LABELS, PROFICIENCY_LABELS } from '@life-restart/shared';

interface MartialPanelProps {
  arts: LearnedArt[];
}

export default function MartialPanel({ arts }: MartialPanelProps) {
  const getArtName = (artId: string) => {
    return MARTIAL_ARTS.find((a) => a.id === artId)?.name || artId;
  };

  const getArtType = (artId: string) => {
    const art = MARTIAL_ARTS.find((a) => a.id === artId);
    return art ? ART_TYPE_LABELS[art.type] : '';
  };

  return (
    <div className="panel">
      <h3 className="text-jianghu-gold font-serif text-center mb-3">武学</h3>
      {arts.length === 0 ? (
        <p className="text-jianghu-ink/40 text-sm text-center">尚未习得武功</p>
      ) : (
        <div className="space-y-2">
          {arts.map((art) => (
            <div key={art.id} className="bg-jianghu-bg rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-jianghu-ink text-sm font-medium">{getArtName(art.artId)}</span>
                <span className="text-jianghu-gold text-xs">{PROFICIENCY_LABELS[art.proficiency as keyof typeof PROFICIENCY_LABELS] || art.proficiency}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-jianghu-ink/40 text-xs">{getArtType(art.artId)}</span>
                <div className="w-20 h-1 bg-jianghu-bg rounded-full">
                  <div
                    className="h-full bg-jianghu-gold/60 rounded-full"
                    style={{ width: `${Math.min(100, art.proficiencyValue)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
