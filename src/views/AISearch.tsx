import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEconomyStore } from '../store/useEconomyStore';
import { runQuery } from '../lib/queryEngine';
import { TopBar } from '../components/layout/TopBar';
import { PlayerCard } from '../components/ui/PlayerCard';
import { EventCard } from '../components/ui/EventCard';
import type { QueryResult } from '../types';
import styles from './AISearch.module.css';

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
  }, []);

  const relevantPlayers = result?.relevantPlayerIds.map((id) => getPlayerById(id)).filter(Boolean) ?? [];
  const relevantEvents = result?.relevantEventIds.map((id) => events.find((e) => e.id === id)).filter(Boolean) ?? [];

  return (
    <div className={styles.root}>
      <TopBar title="AI Search" />
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.chatCol}>
            {/* Search Input */}
            <div className={styles.inputWrap}>
              <span className={styles.searchIcon}>🤖</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Ask anything about Kenya's economy..."
                className={styles.input}
              />
              <button
                onClick={() => handleSearch(query)}
                disabled={loading || !query.trim()}
                className={styles.sendBtn}
              >
                {loading ? '...' : 'Ask'}
              </button>
            </div>

            {/* Suggested Queries */}
            {!result && !loading && (
              <div className={styles.suggestions}>
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => handleSearch(s)} className={styles.suggestionBtn}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Analyzing Kenya's economic data...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className={styles.errorBox}>
                <p>⚠️ {error}</p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className={styles.resultWrap}>
                <div className={styles.answerBox}>
                  <div className={styles.confidenceBadge}>
                    {result.confidence} confidence
                  </div>
                  <div className={styles.answer}>{result.answer}</div>
                </div>

                {/* Follow-ups */}
                {result.followUpQuestions.length > 0 && (
                  <div className={styles.followUps}>
                    <span>Follow up:</span>
                    {result.followUpQuestions.map((q, i) => (
                      <button key={i} onClick={() => handleSearch(q)} className={styles.followUpBtn}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Relevant Players */}
                {relevantPlayers.length > 0 && (
                  <section className={styles.relevantSection}>
                    <h3 className={styles.sectionTitle}>Relevant Entities</h3>
                    <div className={styles.relevantGrid}>
                      {relevantPlayers.map((p) => p && <PlayerCard key={p.id} player={p} />)}
                    </div>
                  </section>
                )}

                {/* Relevant Events */}
                {relevantEvents.length > 0 && (
                  <section className={styles.relevantSection}>
                    <h3 className={styles.sectionTitle}>Related Events</h3>
                    <div className={styles.eventsList}>
                      {relevantEvents.map((e) => e && <EventCard key={e.id} event={e} />)}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* History sidebar */}
          <div className={styles.sideCol}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>History</h3>
              <div className={styles.historyList}>
                {queryHistory.length === 0 && <p className={styles.emptyHistory}>No queries yet.</p>}
                {queryHistory.slice(0, 10).map((h, i) => (
                  <button key={i} onClick={() => handleSearch(h.query)} className={styles.historyItem}>
                    <p className={styles.historyQuery}>{h.query}</p>
                    <p className={styles.historyDate}>{new Date(h.timestamp).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
