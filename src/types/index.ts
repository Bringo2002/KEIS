export type EntityType =
  | 'Listed Company'
  | 'SOE'
  | 'Regulator'
  | 'Ministry'
  | 'Private Company'
  | 'Subsidiary'
  | 'International Org'
  | 'SACCO'
  | 'Bank';

export type Sector =
  | 'Banking'
  | 'Telecommunications'
  | 'Energy'
  | 'Manufacturing'
  | 'Agriculture'
  | 'Real Estate'
  | 'Government'
  | 'Regulation'
  | 'Diversified'
  | 'Insurance'
  | 'Fintech'
  | 'Retail'
  | 'Media'
  | 'Transport'
  | 'Infrastructure';

export interface Player {
  id: string;
  name: string;
  sector: Sector;
  type: EntityType;
  subtype: string;
  founded?: number;
  hq?: string;
  ownership?: string;
  revenue?: string;
  employees?: string;
  marketCap?: string;
  description: string;
  relationships: string[];
  relationshipLabels?: Record<string, string>;
  keyFacts: string[];
  tags: string[];
  recentEvents?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  lastUpdated?: string;
}

export interface EconomicEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  impactType: 'positive' | 'negative' | 'neutral';
  sector: Sector[];
  playerIds: string[];
  source?: string;
  tags: string[];
}

export interface MacroIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent?: number;
  timeSeries: { date: string; value: number }[];
  source: string;
  asOf: string;
}

export interface Relationship {
  sourceId: string;
  targetId: string;
  type:
    | 'ownership'
    | 'debt'
    | 'regulatory'
    | 'partnership'
    | 'supply-chain'
    | 'board-interlock'
    | 'competitor';
  label: string;
  weight?: number;
  direction: 'unidirectional' | 'bidirectional';
}

export interface QueryResult {
  answer: string;
  relevantPlayerIds: string[];
  relevantEventIds: string[];
  confidence: 'high' | 'medium' | 'low';
  followUpQuestions: string[];
}
