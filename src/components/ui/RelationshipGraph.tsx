import { useNavigate } from 'react-router-dom';
import type { Player, Relationship } from '../../types';

interface Props {
  player: Player;
  relatedPlayers: Player[];
  relationships: Relationship[];
}

export function RelationshipGraph({ player, relatedPlayers, relationships }: Props) {
  const navigate = useNavigate();

  const typeColors: Record<Relationship['type'], string> = {
    ownership: '#3b82f6',
    debt: '#ef4444',
    regulatory: '#8b5cf6',
    partnership: '#10b981',
    'supply-chain': '#f59e0b',
    'board-interlock': '#ec4899',
    competitor: '#f97316',
  };

  const getRelType = (otherId: string): Relationship | undefined => {
    return relationships.find(
      (r) =>
        (r.sourceId === player.id && r.targetId === otherId) ||
        (r.targetId === player.id && r.sourceId === otherId)
    );
  };

  return (
    <div className="space-y-2">
      {relatedPlayers.map((rp) => {
        const rel = getRelType(rp.id);
        const color = rel ? typeColors[rel.type] : '#64748b';
        const label = player.relationshipLabels?.[rp.id] ?? rel?.label ?? 'Connected';

        return (
          <div
            key={rp.id}
            onClick={() => navigate(`/player/${rp.id}`)}
            className="flex items-center gap-3 p-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-[#2a2a3e] hover:bg-[#12121a] cursor-pointer transition-all group"
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#e2e8f0] group-hover:text-white truncate">
                {rp.name}
              </div>
              <div className="text-xs text-[#64748b] truncate">{label}</div>
            </div>
            {rel && (
              <span
                className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: `${color}20`,
                  color,
                  border: `1px solid ${color}30`,
                }}
              >
                {rel.type}
              </span>
            )}
          </div>
        );
      })}

      {relatedPlayers.length === 0 && (
        <p className="text-sm text-[#64748b] italic">No relationships mapped.</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#1e1e2e]">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}
