import { useParams, Link } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { RelationshipGraph } from '../components/ui/RelationshipGraph';
import { EventCard } from '../components/ui/EventCard';
import { SectorBadge } from '../components/ui/SectorBadge';
import styles from './PlayerProfile.module.css';

export function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const player = useEconomyStore((s) => s.getPlayerById(id ?? ''));
  const allEvents = useEconomyStore((s) => s.events);
  const getPlayerById = useEconomyStore((s) => s.getPlayerById);
  const allRelationships = useEconomyStore((s) => s.relationships);

  if (!player) {
    return (
      <div className={styles.root}>
        <TopBar title="Profile Not Found" />
        <div className={styles.emptyState}>
          Entity not found.
        </div>
      </div>
    );
  }

  const relatedEvents = allEvents
    .filter((e) => e.playerIds.includes(player.id))
    .sort((a, b) => b.date.localeCompare(a.date));

  // The relationships in useEconomyStore is `Relationship[]`
  // A `Relationship` has `sourceId` and `targetId`.
  // `player.relationships` is `string[]`, which represents IDs of other players!
  // BUT the global `relationships` store contains `Relationship` objects.
  // The `RelationshipGraph` component expects `relationships: Relationship[]`.
  // So we need to filter `allRelationships` to find those involving this player.
  const fullRelationships = allRelationships.filter(
    (r) => r.sourceId === player.id || r.targetId === player.id
  );

  const relatedPlayers = fullRelationships
    .map((r) => {
      const otherId = r.sourceId === player.id ? r.targetId : r.sourceId;
      return getPlayerById(otherId);
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className={styles.root}>
      <TopBar title="Entity Profile" />
      
      <div className={styles.container}>
        <Link to="/players" className={styles.backBtn}>
          ← Back to Players
        </Link>

        {/* Header Profile */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <div className={styles.titleGroup}>
                <h1 className={styles.title}>{player.name}</h1>
                {player.riskLevel && (
                  <span className={`${styles.badge} ${
                    player.riskLevel === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                    player.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {player.riskLevel} Risk
                  </span>
                )}
              </div>
            </div>
            <SectorBadge sector={player.sector} size="md" />
          </div>

          <p className={styles.description}>{player.description}</p>
          
          <div className={styles.tags}>
            <span className={styles.tag}>{player.type}</span>
            {player.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {/* Main Content Column */}
          <div className={styles.mainCol}>
            {/* Network Graph Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Network & Relationships</h2>
              <RelationshipGraph
                player={player}
                relatedPlayers={relatedPlayers}
                relationships={fullRelationships}
              />
            </section>

            {/* Timeline Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Event Timeline</h2>
              {relatedEvents.length > 0 ? (
                <div className={styles.eventsList}>
                  {relatedEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📅</div>
                  <p>No recorded events for this entity yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Info Column */}
          <div className={styles.sideCol}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Details</h2>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Sector</span>
                  <span className={styles.infoValue}>{player.sector}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Entity Type</span>
                  <span className={styles.infoValue}>{player.type}</span>
                </div>
                {player.revenue && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Est. Revenue / Asset Base</span>
                    <span className={`${styles.infoValue} ${styles.infoMono}`}>{player.revenue}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
