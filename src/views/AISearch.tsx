import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { runQuery } from '../lib/queryEngine';
import { TopBar } from '../components/layout/TopBar';
import { PlayerCard } from '../components/ui/PlayerCard';
import { EventCard } from '../components/ui/EventCard';
import type { QueryResult } from '../types';

const SUGGESTED = [
  'Who are the biggest banks in Kenya by assets?',
  'What happened with the Adani JKIA deal?',
  'Which companies are exposed to KES depreciation?',
  'Explain the Finance Bill 2024 protests',
  'How does M-Pesa dominate mobile money?',
  'What is Kenya\'s IMF program about?',
];

export function AISearch() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const players = useEconomyStore((s) => s.players);
  const events = useEconomyStore((s) => s.events);
  const indicators = useEconomyStore((s) => s.indicators);
  const queryHistory = useEconomyStore((s) => s.queryHistory);
  const addQueryToHistory = useEconomyStore((s) => s.addQueryToHistory);
  const getPlayerById = useEconomyStore((s) => s.getPlayerById);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await runQuery(q.trim(), players, events, indicators);
      setResult(r);
      addQueryToHistory(q.trim(), r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) handleSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const relevantPlayers = result?.relevantPlayerIds.map((id) => getPlayerById(id)).filter(Boolean) ?? [];
  const relevantEvents = result?.relevantEventIds.map((id) => events.find((e) => e.id === id)).filter(Boolean) ?? [];

  return (
    <div>
      <TopBar title="AI Search" />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Ask anything about Kenya's economy..."
                className="w-full px-5 py-4 pl-12 rounded-xl border border-[#1e1e2e] bg-[#12121a] text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#006600] focus:ring-1 focus:ring-[#006600]/50 text-base transition-colors"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🤖</span>
              <button
                onClick={() => handleSearch(query)}
                disabled={loading || !query.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-[#006600] text-white text-sm font-medium hover:bg-[#007700] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? '...' : 'Ask'}
              </button>
            </div>

            {/* Suggested Queries */}
            {!result && !loading && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => handleSearch(s)} className="px-3 py-1.5 rounded-full text-xs border border-[#1e1e2e] bg-[#12121a] text-[#94a3b8] hover:text-white hover:border-[#2a2a3e] transition-colors cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-[#006600] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-[#94a3b8]">Analyzing Kenya's economic data...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
                <p className="text-sm text-red-400">⚠️ {error}</p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-6 animate-fade-in">
                <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#006600]/20 text-[#22c55e]">
                      {result.confidence} confidence
                    </span>
                  </div>
                  <div className="text-sm text-[#e2e8f0] leading-relaxed whitespace-pre-wrap">{result.answer}</div>
                </div>

                {/* Follow-ups */}
                {result.followUpQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-[#64748b] self-center mr-1">Follow up:</span>
                    {result.followUpQuestions.map((q, i) => (
                      <button key={i} onClick={() => handleSearch(q)} className="px-3 py-1.5 rounded-full text-xs border border-[#006600]/30 bg-[#006600]/10 text-[#22c55e] hover:bg-[#006600]/20 transition-colors cursor-pointer">
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Relevant Players */}
                {relevantPlayers.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Relevant Entities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {relevantPlayers.map((p) => p && <PlayerCard key={p.id} player={p} />)}
                    </div>
                  </section>
                )}

                {/* Relevant Events */}
                {relevantEvents.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Related Events</h3>
                    <div className="space-y-3">
                      {relevantEvents.map((e) => e && <EventCard key={e.id} event={e} />)}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* History sidebar */}
          <div>
            <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">History</h3>
            <div className="space-y-2">
              {queryHistory.length === 0 && <p className="text-xs text-[#64748b] italic">No queries yet.</p>}
              {queryHistory.slice(0, 10).map((h, i) => (
                <button key={i} onClick={() => handleSearch(h.query)} className="w-full text-left px-3 py-2.5 rounded-lg border border-[#1e1e2e] bg-[#12121a] hover:bg-[#1a1a28] hover:border-[#2a2a3e] transition-colors cursor-pointer">
                  <p className="text-xs text-[#e2e8f0] truncate">{h.query}</p>
                  <p className="text-[10px] text-[#64748b] font-mono mt-0.5">{new Date(h.timestamp).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
