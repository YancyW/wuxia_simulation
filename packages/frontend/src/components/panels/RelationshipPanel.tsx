import type { Relation } from '../../global';
import { RELATION_TYPE_LABELS } from '@life-restart/shared';

interface RelationshipPanelProps {
  relations: Relation[];
}

export default function RelationshipPanel({ relations }: RelationshipPanelProps) {
  return (
    <div className="panel">
      <h3 className="text-jianghu-gold font-serif text-center mb-3">江湖关系</h3>
      {relations.length === 0 ? (
        <p className="text-jianghu-ink/40 text-sm text-center">暂无关系</p>
      ) : (
        <div className="space-y-2">
          {relations.map((rel) => (
            <div key={rel.id} className="bg-jianghu-bg rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-jianghu-ink text-sm font-medium">{rel.npcName}</span>
                <span className="text-jianghu-gold text-xs">
                  {RELATION_TYPE_LABELS[rel.relationType as keyof typeof RELATION_TYPE_LABELS] || rel.relationType}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-jianghu-ink/40 text-xs truncate max-w-[120px]">{rel.description || ''}</span>
                <span className="text-jianghu-ink/60 text-xs">好感 {rel.affinity}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
