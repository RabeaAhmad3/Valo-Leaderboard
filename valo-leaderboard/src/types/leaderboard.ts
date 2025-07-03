export interface LeaderboardEntry {
  rank: number;
  playerId: number;
  puuid: string;
  name: string;
  tag: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  avgAcs: number;
  headshotPercent: number;
}

export interface PlayerStats {
  playerId: number;
  puuid: string;
  name: string;
  tag: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  avgAcs: number;
  avgDamage: number;
  headshotPercent: number;
  firstBloods: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  clutches: number;
  clutchesLost: number;
  clutchWinRate: number;
  economyRating: number;
}

export interface AgentStats {
  agent: string;
  games: number;
  wins: number;
  winRate: number;
  kd: number;
  avgAcs: number;
}

export interface MapStats {
  map: string;
  games: number;
  wins: number;
  winRate: number;
  kd: number;
  avgAcs: number;
}

export interface KillMatrixEntry {
  killerPuuid: string;
  killerName: string;
  killerTag: string;
  victimPuuid: string;
  victimName: string;
  victimTag: string;
  kills: number;
  deaths: number;
}

export interface TierListPlayer {
  playerId: number;
  puuid: string;
  name: string;
  tag: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  compositeScore: number;
  last3GamesKd: number;
  last3GamesAdr: number;
  last3GamesAcs: number;
  last3GamesWinRate: number;
}