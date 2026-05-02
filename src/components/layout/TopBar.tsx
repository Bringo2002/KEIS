import { useEconomyStore } from '../../store/useEconomyStore';
import styles from './TopBar.module.css';

export function TopBar({ title }: { title: string }) {
  const players = useEconomyStore((s) => s.players);
  const events = useEconomyStore((s) => s.events);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.dot} />
            <span className={styles.mono}>{players.length} entities</span>
          </div>
          <span className={styles.divider}>|</span>
          <span className={styles.mono}>{events.length} events</span>
        </div>
      </div>
    </header>
  );
}
