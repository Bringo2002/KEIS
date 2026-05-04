import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, EconomicEvent, MacroIndicator, Relationship, QueryResult, Sector, EntityType } from '../types';

interface EconomyStore {
  players: Player[];
  events: EconomicEvent[];
  indicators: MacroIndicator[];
  relationships: Relationship[];
  isLoading: boolean;
  error: string | null;
  queryHistory: { query: string; result: QueryResult; timestamp: string }[];
  selectedPlayerId: string | null;
  activeFilters: { sector: Sector | null; type: EntityType | null; tags: string[] };
  fetchInitialData: () => Promise<void>;
  setSelectedPlayer: (id: string | null) => void;
  setFilters: (filters: Partial<EconomyStore['activeFilters']>) => void;
  addQueryToHistory: (query: string, result: QueryResult) => void;
  getPlayerById: (id: string) => Player | undefined;
  getRelatedPlayers: (id: string) => Player[];
  getEventsByPlayer: (id: string) => EconomicEvent[];
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const VALID_IMPACTS = new Set(['low', 'medium', 'high'] as const);

function normalizeEvents(input: unknown): EconomicEvent[] {
  if (!Array.isArray(input)) return [];

  return input.map((event) => {
    if (!event || typeof event !== 'object') return event as EconomicEvent;
    const rawImpact = (event as { impact?: unknown }).impact;
    const normalizedImpact = typeof rawImpact === 'string' ? rawImpact.toLowerCase() : '';

    return {
      ...(event as EconomicEvent),
      impact: VALID_IMPACTS.has(normalizedImpact as 'low' | 'medium' | 'high')
        ? (normalizedImpact as EconomicEvent['impact'])
        : 'low',
    };
  });
}

export const useEconomyStore = create<EconomyStore>()(
  persist(
    (set, get) => ({
      players: [],
      events: [],
      indicators: [],
      relationships: [],
      isLoading: false,
      error: null,
      queryHistory: [],
      selectedPlayerId: null,
      activeFilters: { sector: null, type: null, tags: [] },

      fetchInitialData: async () => {
        set({ isLoading: true, error: null });
        try {
          const [playersRes, eventsRes, indicatorsRes, relationshipsRes] = await Promise.all([
            fetch(`${BASE_URL}/api/players?limit=1000`).then((res) => res.json()),
            fetch(`${BASE_URL}/api/events?limit=1000`).then((res) => res.json()),
            fetch(`${BASE_URL}/api/indicators?limit=1000`).then((res) => res.json()),
            fetch(`${BASE_URL}/api/relationships?limit=1000`).then((res) => res.json()),
          ]);

          set({
            players: playersRes.data || playersRes || [],
            events: normalizeEvents(eventsRes.data || eventsRes || []),
            indicators: indicatorsRes.data || indicatorsRes || [],
            relationships: relationshipsRes.data || relationshipsRes || [],
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to fetch initial data:', error);
          set({ error: 'Failed to connect to backend API.', isLoading: false });
        }
      },

      setSelectedPlayer: (id) => set({ selectedPlayerId: id }),

      setFilters: (filters) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, ...filters },
        })),

      addQueryToHistory: (query, result) =>
        set((state) => ({
          queryHistory: [
            { query, result, timestamp: new Date().toISOString() },
            ...state.queryHistory,
          ].slice(0, 50),
        })),

      getPlayerById: (id) => get().players.find((p) => p.id === id),

      getRelatedPlayers: (id) => {
        const player = get().players.find((p) => p.id === id);
        if (!player) return [];
        return get().players.filter((p) => player.relationships.includes(p.id));
      },

      getEventsByPlayer: (id) =>
        get().events.filter((e) => e.playerIds.includes(id)).sort((a, b) => b.date.localeCompare(a.date)),
    }),
    {
      name: 'kenya-economy-store',
      partialize: (state) => ({
        queryHistory: state.queryHistory,
        selectedPlayerId: state.selectedPlayerId,
      }),
    }
  )
);
