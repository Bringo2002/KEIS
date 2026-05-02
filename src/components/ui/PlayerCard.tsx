import { useNavigate } from 'react-router-dom';
import type { Player } from '../../types';
import { SectorBadge } from './SectorBadge';

export function PlayerCard({ player }: { player: Player }) {
  const navigate = useNavigate();

  const riskColors = {
    low: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400',
  };

  return (
    <div
      onClick={() => navigate(`/player/${player.id}`)}
      className="group cursor-pointer rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5 transition-all duration-200 hover:border-[#2a2a3e] hover:bg-[#1a1a28] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-[#e2e8f0] group-hover:text-white transition-colors text-base leading-tight pr-2">
          {player.name}
        </h3>
        {player.riskLevel && (
          <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${riskColors[player.riskLevel]}`}>
            {player.riskLevel}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <SectorBadge sector={player.sector} />
        <span className="text-xs text-[#64748b] font-medium">{player.type}</span>
      </div>

      <p className="text-sm text-[#94a3b8] line-clamp-2 mb-4 leading-relaxed">
        {player.description}
      </p>

      <div className="flex items-center justify-between text-xs text-[#64748b]">
        <span className="font-mono">{player.relationships.length} connections</span>
        {player.revenue && <span className="font-mono">{player.revenue}</span>}
      </div>
    </div>
  );
}
