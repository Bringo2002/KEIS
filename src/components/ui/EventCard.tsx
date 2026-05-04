import { useNavigate } from 'react-router-dom';
import type { EconomicEvent } from '../../types';
import { useEconomyStore } from '../../store/useEconomyStore';
import styles from './EventCard.module.css';

export function EventCard({ event }: { event: EconomicEvent }) {
  const navigate = useNavigate();
  const getPlayerById = useEconomyStore((s) => s.getPlayerById);

  const levelDots = {
    low: '●',
    medium: '●●',
    high: '●●●',
  };
  const impactDots = levelDots[event.impact] ?? '';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <time className={styles.date}>{event.date}</time>
        <span className={`${styles.badge} ${styles[event.impactType]}`}>
          {event.impactType}
          <span className={styles.dots}>
            {impactDots.split('').map((_, i) => (
              <span key={i} className={styles.dot} />
            ))}
          </span>
        </span>
      </div>

      <h3 className={styles.title}>{event.title}</h3>
      <p className={styles.desc}>{event.description}</p>

      {event.playerIds.length > 0 && (
        <div className={styles.players}>
          {event.playerIds.slice(0, 5).map((pid) => {
            const p = getPlayerById(pid);
            return p ? (
              <button
                key={pid}
                onClick={() => navigate(`/player/${pid}`)}
                className={styles.player}
              >
                {p.name}
              </button>
            ) : null;
          })}
          {event.playerIds.length > 5 && (
            <span className={styles.playerMore}>+{event.playerIds.length - 5} more</span>
          )}
        </div>
      )}
    </div>
  );
}
