import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { SectorBadge } from '../components/ui/SectorBadge';
import type { Sector } from '../types';
import styles from './Sectors.module.css';

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
    <div className={styles.root}>
      <TopBar title="Sectors" />
      <div className={styles.container}>
        <div className={styles.grid}>
          {sectorData.map(([sector, data]) => {
            const top3 = data.players.slice(0, 3);
            return (
              <div
                key={sector}
                onClick={() => navigate(`/players?sector=${sector}`)}
                className={styles.card}
              >
                <div className={styles.header}>
                  <SectorBadge sector={sector} size="md" />
                  <span className={styles.count}>{data.players.length} entities</span>
                </div>

                <div className={styles.playersList}>
                  {top3.map((p) => (
                    <div key={p.id} className={styles.playerItem}>
                      <span className={styles.bullet}>▸</span>
                      {p.name}
                    </div>
                  ))}
                  {data.players.length > 3 && (
                    <p className={styles.more}>+{data.players.length - 3} more</p>
                  )}
                </div>

                <div className={styles.footer}>
                  <span className={styles.eventsCount}>{data.eventCount} events</span>
                  <span className={styles.viewAll}>View all →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
