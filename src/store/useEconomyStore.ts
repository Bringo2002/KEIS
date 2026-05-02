import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, EconomicEvent, MacroIndicator, Relationship, QueryResult, Sector, EntityType } from '../types';
import { players as seedPlayers } from '../data/players';
import { events as seedEvents } from '../data/events';
import { indicators as seedIndicators } from '../data/indicators';
import { relationships as seedRelationships } from '../data/relationships';

interface EconomyStore {
  players: Player[];
  events: EconomicEvent[];
  indicators: MacroIndicator[];
  relationships: Relationship[];
  queryHistory: { query: string; result: QueryResult; timestamp: string }[];
  selectedPlayerId: string | null;
  activeFilters: { sector: Sector | null; type: EntityType | null; tags: string[] };
  setSelectedPlayer: (id: string | null) => void;
  setFilters: (filters: Partial<EconomyStore['activeFilters']>) => void;
  addQueryToHistory: (query: string, result: QueryResult) => void;
  getPlayerById: (id: string) => Player | undefined;
  getRelatedPlayers: (id: string) => Player[];
  getEventsByPlayer: (id: string) => EconomicEvent[];
}

export const useEconomyStore = create<EconomyStore>()(
  persist(
    (set, get) => ({
      players: seedPlayers,
      events: seedEvents,
      indicators: seedIndicators,
      relationships: seedRelationships,
      queryHistory: [],
      selectedPlayerId: null,
      activeFilters: { sector: null, type: null, tags: [] },

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
