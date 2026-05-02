import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { SectorBadge } from '../components/ui/SectorBadge';
import type { Sector } from '../types';

export function Sectors() {
  const players = useEconomyStore((s) => s.players);
  const events = useEconomyStore((s) => s.events);
  const navigate = useNavigate();

  const sectorData = useMemo(() => {
    const map = new Map<Sector, { players: typeof players; eventCount: number }>();
    players.forEach((p) => {
      if (!map.has(p.sector)) map.set(p.sector, { players: [], eventCount: 0 });
      map.get(p.sector)!.players.push(p);
    });
    events.forEach((e) => {
      e.sector.forEach((s) => {
        if (map.has(s)) map.get(s)!.eventCount++;
      });
    });
    return [...map.entries()].sort((a, b) => b[1].players.length - a[1].players.length);
  }, [players, events]);

  return (
    <div>
      <TopBar title="Sectors" />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sectorData.map(([sector, data]) => {
            const top3 = data.players.slice(0, 3);
            return (
              <div
                key={sector}
                onClick={() => navigate(`/players?sector=${sector}`)}
                className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6 cursor-pointer hover:border-[#2a2a3e] hover:bg-[#1a1a28] hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <SectorBadge sector={sector} size="md" />
                  <span className="text-xs font-mono text-[#64748b]">{data.players.length} entities</span>
                </div>

                <div className="space-y-2 mb-4">
                  {top3.map((p) => (
                    <div key={p.id} className="text-sm text-[#e2e8f0]">
                      <span className="text-[#006600] mr-1.5">▸</span>
                      {p.name}
                    </div>
                  ))}
                  {data.players.length > 3 && (
                    <p className="text-xs text-[#64748b]">+{data.players.length - 3} more</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1e1e2e]">
                  <span className="text-xs text-[#64748b]">{data.eventCount} events</span>
                  <span className="text-xs text-[#006600] opacity-0 group-hover:opacity-100 transition-opacity">View all →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
