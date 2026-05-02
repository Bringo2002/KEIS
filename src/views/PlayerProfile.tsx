import { useParams, useNavigate } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { TopBar } from '../components/layout/TopBar';
import { SectorBadge } from '../components/ui/SectorBadge';
import { EventCard } from '../components/ui/EventCard';
import { RelationshipGraph } from '../components/ui/RelationshipGraph';

export function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getPlayerById = useEconomyStore((s) => s.getPlayerById);
  const getRelatedPlayers = useEconomyStore((s) => s.getRelatedPlayers);
  const getEventsByPlayer = useEconomyStore((s) => s.getEventsByPlayer);
  const relationships = useEconomyStore((s) => s.relationships);

  const player = id ? getPlayerById(id) : undefined;
  if (!player) {
    return (
      <div>
        <TopBar title="Player Not Found" />
        <div className="p-6 text-center text-[#94a3b8]">
          <p className="text-4xl mb-4">🚫</p>
          <p>Entity not found.</p>
          <button onClick={() => navigate('/players')} className="mt-4 text-sm text-[#006600] hover:underline">← Back to Players</button>
        </div>
      </div>
    );
  }

  const related = getRelatedPlayers(player.id);
  const playerEvents = getEventsByPlayer(player.id);

  const riskColors = { low: 'bg-green-500/20 text-green-400', medium: 'bg-yellow-500/20 text-yellow-400', high: 'bg-red-500/20 text-red-400' };

  return (
    <div>
      <TopBar title={player.name} />
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)} className="text-xs text-[#64748b] hover:text-[#e2e8f0] mb-4 inline-block transition-colors">← Back</button>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-white">{player.name}</h1>
            <SectorBadge sector={player.sector} size="md" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e2e] text-[#94a3b8] border border-[#2a2a3e]">{player.type}</span>
            {player.riskLevel && (
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${riskColors[player.riskLevel]}`}>
                {player.riskLevel} risk
              </span>
            )}
          </div>
          <p className="text-[#94a3b8] leading-relaxed max-w-3xl">{player.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Key Facts */}
            <section className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6">
              <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Key Facts</h2>
              <ul className="space-y-2">
                {player.keyFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#e2e8f0]">
                    <span className="text-[#006600] mt-0.5">▸</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </section>

            {/* Financials */}
            <section className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6">
              <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {player.founded && <InfoItem label="Founded" value={String(player.founded)} />}
                {player.hq && <InfoItem label="Headquarters" value={player.hq} />}
                {player.ownership && <InfoItem label="Ownership" value={player.ownership} />}
                {player.revenue && <InfoItem label="Revenue" value={player.revenue} />}
                {player.employees && <InfoItem label="Employees" value={player.employees} />}
                {player.marketCap && <InfoItem label="Market Cap" value={player.marketCap} />}
                <InfoItem label="Subtype" value={player.subtype} />
              </div>
            </section>

            {/* Events */}
            {playerEvents.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Related Events</h2>
                <div className="space-y-3">
                  {playerEvents.map((evt) => (
                    <EventCard key={evt.id} event={evt} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* AI Button */}
            <button
              onClick={() => navigate(`/ai-search?q=Tell me about ${player.name}`)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#006600] to-[#008800] text-white font-medium text-sm hover:from-[#007700] hover:to-[#009900] transition-all shadow-lg shadow-[#006600]/20 cursor-pointer"
            >
              🤖 Ask AI about {player.name}
            </button>

            {/* Relationships */}
            <section className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5">
              <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">
                Relationships ({related.length})
              </h2>
              <RelationshipGraph player={player} relatedPlayers={related} relationships={relationships} />
            </section>

            {/* Tags */}
            <section className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-5">
              <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {player.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#1e1e2e] text-[#94a3b8] font-mono">#{tag}</span>
                ))}
              </div>
            </section>

            {player.lastUpdated && (
              <p className="text-[10px] text-[#64748b] font-mono text-center">Last updated: {player.lastUpdated}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#64748b] uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm text-[#e2e8f0] font-medium">{value}</div>
    </div>
  );
}
