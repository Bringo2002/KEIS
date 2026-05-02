import { useState, useMemo } from 'react';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { EventCard } from '../components/ui/EventCard';
import type { EconomicEvent } from '../types';
import styles from './Timeline.module.css';

const IMPACT_TYPES: EconomicEvent['impactType'][] = ['positive', 'negative', 'neutral'];

export function Timeline() {
  const events = useEconomyStore((s) => s.events);
  const [impactFilter, setImpactFilter] = useState<EconomicEvent['impactType'] | null>(null);

  const sortedEvents = useMemo(() => {
    let filtered = events;
    if (impactFilter) {
      filtered = filtered.filter((e) => e.impactType === impactFilter);
    }
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [events, impactFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, EconomicEvent[]> = {};
    sortedEvents.forEach((evt) => {
      const date = new Date(evt.date);
      const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(evt);
    });
    return groups;
  }, [sortedEvents]);

  return (
    <div className={styles.root}>
      <TopBar title="Event Timeline" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.filters}>
            <button
              onClick={() => setImpactFilter(null)}
              className={`${styles.filterBtn} ${!impactFilter ? styles.filterBtnActive : ''}`}
            >
              All Events
            </button>
            {IMPACT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setImpactFilter(impactFilter === type ? null : type)}
                className={`${styles.filterBtn} ${impactFilter === type ? styles.filterBtnActive : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          
          <div className={styles.events}>
            {Object.entries(grouped).map(([monthYear, evts]) => (
              <div key={monthYear} className={styles.eventGroup}>
                <div className={styles.dateCol}>
                  <div className={styles.month}>{monthYear.split(' ')[0]}</div>
                  <div className={styles.year}>{monthYear.split(' ')[1]}</div>
                </div>
                
                <div className={styles.contentCol}>
                  {evts.map((evt) => (
                    <div key={evt.id} className={styles.cardWrap}>
                      <div className={`${styles.node} ${styles['node' + evt.impactType.charAt(0).toUpperCase() + evt.impactType.slice(1)]}`} />
                      <EventCard event={evt} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
