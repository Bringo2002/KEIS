import type { Sector } from '../../types';
import styles from './SectorBadge.module.css';

export function SectorBadge({ sector, size = 'sm' }: { sector: Sector; size?: 'sm' | 'md' }) {
  // Map sector to module class name
  const sectorClass = sector.toLowerCase().replace(/[^a-z]/g, '');
  const styleClass = styles[sectorClass] || styles.default;
  const sizeClass = size === 'sm' ? styles.sm : styles.md;

  return (
    <span className={`${styles.badge} ${sizeClass} ${styleClass}`}>
      {sector}
    </span>
  );
}
