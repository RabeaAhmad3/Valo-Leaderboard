export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  type: 'serious' | 'troll';
  condition: (stats: BadgeStats) => boolean;
}

export interface BadgeStats {
  kd: number;
  headshotPercent: number;
  clutches: number;
  clutchWinRate: number;
  economyRating: number;
  firstBloodShare: number;
  recentFirstBloodsAvg: number;
  plants: number;
  defuses: number;
  totalGames: number;
  legShotPercent: number;
  avgAcs: number;
  isBottomFrag: boolean;
  isBottomestFrag: boolean;
  hasMostClutches: boolean;
  kdPercentile: number;
  winRatePercentile: number;
  acsPercentile: number;
}

export const BADGES: Badge[] = [
  {
    id: 'raid-boss',
    name: 'Raid Boss',
    description: 'KD ≥ 1.5',
    type: 'serious',
    condition: (stats) => stats.kd >= 1.5,
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Headshot % ≥ 25%',
    type: 'serious',
    condition: (stats) => stats.headshotPercent >= 25,
  },
  {
    id: 'clutch-king',
    name: 'Clutch King',
    description: '≥5 clutches & clutch win % ≥ 60%',
    type: 'serious',
    condition: (stats) => stats.clutches >= 5 && stats.clutchWinRate >= 60,
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Damage per credit ≥ 1.25',
    type: 'serious',
    condition: (stats) => stats.economyRating >= 1.25,
  },
  {
    id: 'entry-fragger',
    name: 'Entry Fragger',
    description: 'Average 4+ first bloods in last 3 games',
    type: 'serious',
    condition: (stats) => stats.recentFirstBloodsAvg >= 4,
  },
  {
    id: 'spike-whisperer',
    name: 'Spike Whisperer',
    description: 'Average 5+ plants/defuses per game',
    type: 'serious',
    condition: (stats) => stats.totalGames > 0 && ((stats.plants + stats.defuses) / stats.totalGames) >= 5,
  },
  {
    id: 'cold-blooded',
    name: 'Cold Blooded',
    description: 'Most clutches overall',
    type: 'serious',
    condition: (stats) => stats.hasMostClutches,
  },
  {
    id: 'toe-shooter',
    name: 'Toe Shooter',
    description: 'Leg shot % ≥ 15%',
    type: 'troll',
    condition: (stats) => stats.legShotPercent >= 15,
  },
  {
    id: 'bottom-frag',
    name: 'Bottom Frag',
    description: 'Bottom 10% ACS',
    type: 'troll',
    condition: (stats) => stats.isBottomFrag,
  },
  {
    id: 'bottomest-frag',
    name: 'Bottomest Frag',
    description: 'Worst ACS out of everyone',
    type: 'troll',
    condition: (stats) => stats.isBottomestFrag,
  },
  {
    id: 'consistently-mid',
    name: 'Consistently Mid',
    description: 'Average K/D, W/L, and ACS (40-60th percentile)',
    type: 'troll',
    condition: (stats) => 
      stats.kdPercentile >= 40 && stats.kdPercentile <= 60 &&
      stats.winRatePercentile >= 40 && stats.winRatePercentile <= 60 &&
      stats.acsPercentile >= 40 && stats.acsPercentile <= 60,
  },
  {
    id: 'passenger-princess',
    name: 'Passenger Princess',
    description: 'Positive win rate but bottom 20% K/D and ACS',
    type: 'troll',
    condition: (stats) => 
      stats.winRatePercentile > 50 &&
      stats.kdPercentile <= 20 &&
      stats.acsPercentile <= 20,
  },
];