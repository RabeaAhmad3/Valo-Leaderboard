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
  plants: number;
  defuses: number;
  totalGames: number;
  legShotPercent: number;
  avgAcs: number;
  isBottomFrag: boolean;
  isBottomestFrag: boolean;
  hasMostClutches: boolean;
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
    description: 'First blood share ≥ 30%',
    type: 'serious',
    condition: (stats) => stats.firstBloodShare >= 30,
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
];