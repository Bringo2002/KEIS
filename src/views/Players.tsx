import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { PlayerCard } from '../components/ui/PlayerCard';
import { SectorBadge } from '../components/ui/SectorBadge';
import type { Sector, EntityType } from '../types';
import styles from './Players.module.css';

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
    <div className={styles.root}>
      <TopBar title="Players" />
      <div className={styles.container}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search entities by name, description, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {/* Sector Chips */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <button 
              onClick={() => setSectorFilter(null)} 
              className={`${styles.filterBtn} ${!sectorFilter ? styles.filterBtnActive : ''}`}
            >
              All Sectors
            </button>
            {activeSectors.map((s) => (
              <button 
                key={s} 
                onClick={() => setSectorFilter(sectorFilter === s ? null : s)} 
                className={`${styles.filterBtnClear} ${sectorFilter === s ? styles.filterBtnClearActive : ''}`}
              >
                <SectorBadge sector={s} />
              </button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <button 
              onClick={() => setTypeFilter(null)} 
              className={`${styles.filterBtn} ${!typeFilter ? styles.filterBtnActive : ''}`}
            >
              All Types
            </button>
            {activeTypes.map((t) => (
              <button 
                key={t} 
                onClick={() => setTypeFilter(typeFilter === t ? null : t)} 
                className={`${styles.filterBtn} ${typeFilter === t ? styles.filterBtnActive : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className={styles.meta}>{filtered.length} of {players.length} entities</div>

        <div className={styles.grid}>
          {filtered.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🔍</p>
            <p className={styles.emptyText}>No entities match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
