import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { PlayerCard } from '../components/ui/PlayerCard';
import { SectorBadge } from '../components/ui/SectorBadge';
import type { Sector, EntityType } from '../types';

const ALL_SECTORS: Sector[] = ['Banking','Telecommunications','Energy','Manufacturing','Agriculture','Real Estate','Government','Regulation','Diversified','Insurance','Fintech','Retail','Media','Transport','Infrastructure'];
const ALL_TYPES: EntityType[] = ['Listed Company','SOE','Regulator','Ministry','Private Company','Subsidiary','International Org','SACCO','Bank'];

export function Players() {
  const players = useEconomyStore((s) => s.players);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<Sector | null>((searchParams.get('sector') as Sector) ?? null);
  const [typeFilter, setTypeFilter] = useState<EntityType | null>(null);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.includes(search.toLowerCase()));
      const matchesSector = !sectorFilter || p.sector === sectorFilter;
      const matchesType = !typeFilter || p.type === typeFilter;
      return matchesSearch && matchesSector && matchesType;
    });
  }, [players, search, sectorFilter, typeFilter]);

  const activeSectors = useMemo(() => {
    const s = new Set(players.map((p) => p.sector));
    return ALL_SECTORS.filter((sec) => s.has(sec));
  }, [players]);

  const activeTypes = useMemo(() => {
    const t = new Set(players.map((p) => p.type));
    return ALL_TYPES.filter((type) => t.has(type));
  }, [players]);

  return (
    <div>
      <TopBar title="Players" />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search entities by name, description, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-[#1e1e2e] bg-[#12121a] text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#006600] focus:ring-1 focus:ring-[#006600]/50 transition-colors text-sm"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]">🔍</span>
        </div>

        {/* Sector Chips */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSectorFilter(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${!sectorFilter ? 'bg-[#006600]/20 text-[#22c55e] border-[#006600]/40' : 'bg-[#12121a] text-[#94a3b8] border-[#1e1e2e] hover:border-[#2a2a3e]'}`}>All Sectors</button>
            {activeSectors.map((s) => (
              <button key={s} onClick={() => setSectorFilter(sectorFilter === s ? null : s)} className={sectorFilter === s ? 'opacity-100' : 'opacity-70 hover:opacity-100'}>
                <SectorBadge sector={s} />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTypeFilter(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${!typeFilter ? 'bg-[#006600]/20 text-[#22c55e] border-[#006600]/40' : 'bg-[#12121a] text-[#94a3b8] border-[#1e1e2e] hover:border-[#2a2a3e]'}`}>All Types</button>
            {activeTypes.map((t) => (
              <button key={t} onClick={() => setTypeFilter(typeFilter === t ? null : t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${typeFilter === t ? 'bg-[#006600]/20 text-[#22c55e] border-[#006600]/40' : 'bg-[#12121a] text-[#94a3b8] border-[#1e1e2e] hover:border-[#2a2a3e]'}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="text-xs text-[#64748b]">{filtered.length} of {players.length} entities</div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#64748b]">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No entities match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
