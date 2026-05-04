import { useNavigate } from 'react-router-dom';
import type { Player } from '../../types';
import { SectorBadge } from './SectorBadge';
import styles from './PlayerCard.module.css';

export function PlayerCard({ player }: { player: Player }) {
  const navigate = useNavigate();
  const relationships = Array.isArray(player.relationships) ? player.relationships : [];

  return (
    <div
      onClick={() => navigate(`/player/${player.id}`)}
      className={styles.card}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>
          {player.name}
        </h3>
        {player.riskLevel && (
          <span className={`${styles.badge} ${styles[player.riskLevel]}`}>
            {player.riskLevel}
          </span>
        )}
      </div>

      <div className={styles.tags}>
        <SectorBadge sector={player.sector} />
        <span className={styles.type}>{player.type}</span>
      </div>

      <p className={styles.description}>
        {player.description}
      </p>

      <div className={styles.footer}>
        <span className={styles.relations}>{relationships.length} connections</span>
        {player.revenue && <span className={styles.revenue}>{player.revenue}</span>}
      </div>
    </div>
  );
}
