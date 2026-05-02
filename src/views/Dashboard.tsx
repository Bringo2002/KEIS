import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { IndicatorSparkline } from '../components/ui/IndicatorSparkline';
import { EventCard } from '../components/ui/EventCard';
import type { Sector } from '../types';
import styles from './Dashboard.module.css';

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
    <div className={styles.root}>
      <TopBar title="Dashboard" />
      <div className={styles.container}>
        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{players.length}</div>
            <div className={styles.statLabel}>Entities Tracked</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{uniqueSectors}</div>
            <div className={styles.statLabel}>Sectors Covered</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{events.length}</div>
            <div className={styles.statLabel}>Events Recorded</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{indicators.length}</div>
            <div className={styles.statLabel}>Macro Indicators</div>
          </div>
        </div>

        {/* Macro Indicators */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Indicators</h2>
          <div className={styles.indicatorsGrid}>
            {topIndicators.map((ind) => (
              <IndicatorSparkline key={ind.id} indicator={ind} />
            ))}
          </div>
        </section>

        <div className={styles.mainGrid}>
          {/* Recent Events */}
          <section className={styles.eventsCol}>
            <h2 className={styles.sectionTitle}>Recent Events</h2>
            <div className={styles.eventsList}>
              {recentEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </section>

          {/* Sector Breakdown */}
          <section className={styles.sectorsCol}>
            <h2 className={styles.sectionTitle}>Sectors</h2>
            <div className={styles.sectorsList}>
              {sectors.map(([sector, count]) => (
                <div key={sector} className={styles.sectorItem}>
                  <span className={styles.sectorName}>{sector}</span>
                  <span className={styles.sectorCount}>{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
