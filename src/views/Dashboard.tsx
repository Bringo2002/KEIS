import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { IndicatorSparkline } from '../components/ui/IndicatorSparkline';
import { EventCard } from '../components/ui/EventCard';
import type { Sector } from '../types';

export function Dashboard() {
  const indicators = useEconomyStore((s) => s.indicators);
  const events = useEconomyStore((s) => s.events);
  const players = useEconomyStore((s) => s.players);

  const topIndicators = indicators.filter((i) =>
    ['usd-kes', 'cbr', 'inflation', 'nse20'].includes(i.id)
  );

  const recentEvents = [...events]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  const sectorCounts = players.reduce<Record<string, number>>((acc, p) => {
    acc[p.sector] = (acc[p.sector] || 0) + 1;
    return acc;
  }, {});

  const sectors = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1]) as [Sector, number][];

  const uniqueSectors = new Set(players.map((p) => p.sector)).size;

  return (
    <div>
      <TopBar title="Dashboard" />
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#e2e8f0]">{players.length}</div>
            <div className="text-xs text-[#64748b] mt-1">Entities Tracked</div>
          </div>
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#e2e8f0]">{uniqueSectors}</div>
            <div className="text-xs text-[#64748b] mt-1">Sectors Covered</div>
          </div>
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#e2e8f0]">{events.length}</div>
            <div className="text-xs text-[#64748b] mt-1">Events Recorded</div>
          </div>
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 text-center">
            <div className="text-2xl font-bold font-mono text-[#e2e8f0]">{indicators.length}</div>
            <div className="text-xs text-[#64748b] mt-1">Macro Indicators</div>
          </div>
        </div>

        {/* Macro Indicators */}
        <section>
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Key Indicators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topIndicators.map((ind) => (
              <IndicatorSparkline key={ind.id} indicator={ind} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Events */}
          <section className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Recent Events</h2>
            <div className="space-y-3">
              {recentEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </section>

          {/* Sector Breakdown */}
          <section>
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Sectors</h2>
            <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] divide-y divide-[#1e1e2e]">
              {sectors.map(([sector, count]) => (
                <div key={sector} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-[#e2e8f0]">{sector}</span>
                  <span className="text-xs font-mono text-[#64748b] bg-[#1e1e2e] px-2 py-0.5 rounded-full">{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
