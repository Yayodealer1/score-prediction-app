export interface PredictionRequest {
  league: string;
  country: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface PredictionResult {
  rawText: string;
  groundingChunks: GroundingChunk[];
}

export enum LeagueId {
  PL = 'Premier League',
  LIGA = 'La Liga',
  SERIE_A = 'Serie A',
  LIGA_NOS = 'Liga Portugal'
}

export const LEAGUES = [
  { id: LeagueId.PL, name: 'Premier League', country: 'England', flag: '🇬🇧', icon: '🦁' },
  { id: LeagueId.LIGA, name: 'La Liga', country: 'Spain', flag: '🇪🇸', icon: '🐂' },
  { id: LeagueId.LIGA_NOS, name: 'Liga Portugal', country: 'Portugal', flag: '🇵🇹', icon: '🛡️' },
  { id: LeagueId.SERIE_A, name: 'Serie A', country: 'Italy', flag: '🇮🇹', icon: '🏛️' },
];