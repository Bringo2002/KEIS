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
const VALID_IMPACT_TYPES = new Set(['positive', 'negative', 'neutral'] as const);

function normalizePlayers(input: unknown): Player[] {
  if (!Array.isArray(input)) return [];

  return input.map((player) => {
    if (!player || typeof player !== 'object') {
      return {
        id: '',
        name: 'Unknown',
        sector: 'Diversified',
        type: 'Private Company',
        subtype: '',
        description: '',
        relationships: [],
        keyFacts: [],
        tags: [],
      };
    }

    const raw = player as Partial<Player>;
    return {
      id: typeof raw.id === 'string' ? raw.id : '',
      name: typeof raw.name === 'string' ? raw.name : 'Unknown',
      sector: (typeof raw.sector === 'string' ? raw.sector : 'Diversified') as Sector,
      type: (typeof raw.type === 'string' ? raw.type : 'Private Company') as EntityType,
      subtype: typeof raw.subtype === 'string' ? raw.subtype : '',
      founded: typeof raw.founded === 'number' ? raw.founded : undefined,
      hq: typeof raw.hq === 'string' ? raw.hq : undefined,
      ownership: typeof raw.ownership === 'string' ? raw.ownership : undefined,
      revenue: typeof raw.revenue === 'string' ? raw.revenue : undefined,
      employees: typeof raw.employees === 'string' ? raw.employees : undefined,
      marketCap: typeof raw.marketCap === 'string' ? raw.marketCap : undefined,
      description: typeof raw.description === 'string' ? raw.description : '',
      relationships: Array.isArray(raw.relationships)
        ? raw.relationships.filter((id): id is string => typeof id === 'string')
        : [],
      relationshipLabels:
        raw.relationshipLabels && typeof raw.relationshipLabels === 'object'
          ? raw.relationshipLabels
          : undefined,
      keyFacts: Array.isArray(raw.keyFacts) ? raw.keyFacts.filter((f): f is string => typeof f === 'string') : [],
      tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      recentEvents: Array.isArray(raw.recentEvents)
        ? raw.recentEvents.filter((id): id is string => typeof id === 'string')
        : undefined,
      riskLevel: raw.riskLevel,
      lastUpdated: typeof raw.lastUpdated === 'string' ? raw.lastUpdated : undefined,
    };
  });
}

function normalizeEvents(input: unknown): EconomicEvent[] {
  if (!Array.isArray(input)) return [];

  return input.map((event) => {
    if (!event || typeof event !== 'object') {
      return {
        id: '',
        date: '',
        title: '',
        description: '',
        impact: 'low',
        impactType: 'neutral',
        sector: [],
        playerIds: [],
        tags: [],
      };
    }
    const raw = event as Partial<EconomicEvent> & { impact?: unknown; impactType?: unknown };
    const rawImpact = raw.impact;
    const normalizedImpact = typeof rawImpact === 'string' ? rawImpact.toLowerCase() : '';
    const rawImpactType = raw.impactType;
    const normalizedImpactType = typeof rawImpactType === 'string' ? rawImpactType.toLowerCase() : '';

    return {
      id: typeof raw.id === 'string' ? raw.id : '',
      date: typeof raw.date === 'string' ? raw.date : '',
      title: typeof raw.title === 'string' ? raw.title : '',
      description: typeof raw.description === 'string' ? raw.description : '',
      impact: VALID_IMPACTS.has(normalizedImpact as 'low' | 'medium' | 'high')
        ? (normalizedImpact as EconomicEvent['impact'])
        : 'low',
      impactType: VALID_IMPACT_TYPES.has(normalizedImpactType as 'positive' | 'negative' | 'neutral')
        ? (normalizedImpactType as EconomicEvent['impactType'])
        : 'neutral',
      sector: Array.isArray(raw.sector) ? raw.sector : [],
      playerIds: Array.isArray(raw.playerIds) ? raw.playerIds.filter((id): id is string => typeof id === 'string') : [],
      tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      source: typeof raw.source === 'string' ? raw.source : undefined,
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
            players: normalizePlayers(playersRes.data || playersRes || []),
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
