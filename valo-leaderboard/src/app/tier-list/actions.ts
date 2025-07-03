'use server';

import { calculateTierList } from '@/utils/tier-calculator';
import { TierListPlayer } from '@/types/leaderboard';

export async function getTierListData(): Promise<{
  players: TierListPlayer[];
  tiers: Record<'S' | 'A' | 'B' | 'C' | 'D', TierListPlayer[]>;
}> {
  const players = await calculateTierList();
  
  // Group players by tier
  const tiers: Record<'S' | 'A' | 'B' | 'C' | 'D', TierListPlayer[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  };

  players.forEach(player => {
    tiers[player.tier].push(player);
  });

  return { players, tiers };
}