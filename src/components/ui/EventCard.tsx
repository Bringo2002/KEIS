import { useNavigate } from 'react-router-dom';
import type { EconomicEvent } from '../../types';
import { useEconomyStore } from '../../store/useEconomyStore';

export function EventCard({ event }: { event: EconomicEvent }) {
  const navigate = useNavigate();
  const getPlayerById = useEconomyStore((s) => s.getPlayerById);

  const impactColors = {
    positive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    negative: 'bg-red-500/20 text-red-400 border-red-500/30',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const levelDots = {
    low: '●',
    medium: '●●',
    high: '●●●',
  };

  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5 transition-all duration-200 hover:border-[#2a2a3e] hover:bg-[#1a1a28]">
      <div className="flex items-start justify-between mb-2">
        <time className="text-xs font-mono text-[#64748b]">{event.date}</time>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${impactColors[event.impactType]}`}>
          {event.impactType} {levelDots[event.impact]}
        </span>
      </div>

      <h3 className="font-semibold text-[#e2e8f0] mb-2 text-sm leading-tight">{event.title}</h3>
      <p className="text-sm text-[#94a3b8] mb-3 leading-relaxed">{event.description}</p>

      {event.playerIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.playerIds.slice(0, 5).map((pid) => {
            const p = getPlayerById(pid);
            return p ? (
              <button
                key={pid}
                onClick={() => navigate(`/player/${pid}`)}
                className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e2e] text-[#94a3b8] hover:text-white hover:bg-[#2a2a3e] transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ) : null;
          })}
          {event.playerIds.length > 5 && (
            <span className="text-xs text-[#64748b] px-1">+{event.playerIds.length - 5} more</span>
          )}
        </div>
      )}
    </div>
  );
}
