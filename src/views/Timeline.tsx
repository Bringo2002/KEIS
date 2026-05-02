import { useState, useMemo } from 'react';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { EventCard } from '../components/ui/EventCard';
import type { Sector } from '../types';

export function Timeline() {
  const events = useEconomyStore((s) => s.events);
  const [sectorFilter, setSectorFilter] = useState<Sector | null>(null);
  const [impactFilter, setImpactFilter] = useState<'positive' | 'negative' | 'neutral' | null>(null);
  const [levelFilter, setLevelFilter] = useState<'low' | 'medium' | 'high' | null>(null);

  const filtered = useMemo(() => {
    return [...events]
      .filter((e) => {
        if (sectorFilter && !e.sector.includes(sectorFilter)) return false;
        if (impactFilter && e.impactType !== impactFilter) return false;
        if (levelFilter && e.impact !== levelFilter) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, sectorFilter, impactFilter, levelFilter]);

  const sectors = useMemo(() => {
    const s = new Set<Sector>();
    events.forEach((e) => e.sector.forEach((sec) => s.add(sec)));
    return [...s].sort();
  }, [events]);

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
      active ? 'bg-[#006600]/20 text-[#22c55e] border-[#006600]/40' : 'bg-[#12121a] text-[#94a3b8] border-[#1e1e2e] hover:border-[#2a2a3e]'
    }`;

  return (
    <div>
      <TopBar title="Timeline" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSectorFilter(null)} className={chipClass(!sectorFilter)}>All Sectors</button>
            {sectors.map((s) => (
              <button key={s} onClick={() => setSectorFilter(sectorFilter === s ? null : s)} className={chipClass(sectorFilter === s)}>{s}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setImpactFilter(null)} className={chipClass(!impactFilter)}>All Impact</button>
            <button onClick={() => setImpactFilter(impactFilter === 'positive' ? null : 'positive')} className={chipClass(impactFilter === 'positive')}>✅ Positive</button>
            <button onClick={() => setImpactFilter(impactFilter === 'negative' ? null : 'negative')} className={chipClass(impactFilter === 'negative')}>🔴 Negative</button>
            <button onClick={() => setImpactFilter(impactFilter === 'neutral' ? null : 'neutral')} className={chipClass(impactFilter === 'neutral')}>⚪ Neutral</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLevelFilter(null)} className={chipClass(!levelFilter)}>All Levels</button>
            <button onClick={() => setLevelFilter(levelFilter === 'high' ? null : 'high')} className={chipClass(levelFilter === 'high')}>High Impact</button>
            <button onClick={() => setLevelFilter(levelFilter === 'medium' ? null : 'medium')} className={chipClass(levelFilter === 'medium')}>Medium</button>
            <button onClick={() => setLevelFilter(levelFilter === 'low' ? null : 'low')} className={chipClass(levelFilter === 'low')}>Low</button>
          </div>
        </div>

        <p className="text-xs text-[#64748b]">{filtered.length} events</p>

        <div className="space-y-3">
          {filtered.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#64748b]">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-sm">No events match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
