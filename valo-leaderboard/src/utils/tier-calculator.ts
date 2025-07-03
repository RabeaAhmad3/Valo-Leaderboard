import { prisma } from '@/lib/prisma';
import { TierListPlayer } from '@/types/leaderboard';

interface PlayerStats {
  playerId: number;
  puuid: string;
  name: string;
  tag: string;
  kd: number;
  adr: number; // Average damage per round
  acs: number;
  winRate: number;
}

export async function calculateTierList(): Promise<TierListPlayer[]> {
  // Get all players with their last 3 matches
  const players = await prisma.player.findMany({
    include: {
      matches: {
        include: { match: true },
        orderBy: { match: { startedAt: 'desc' } },
        take: 3,
      },
    },
  });

  // Filter players who have at least 3 matches
  const playersWithEnoughMatches = players.filter(p => p.matches.length === 3);

  if (playersWithEnoughMatches.length === 0) {
    return [];
  }

  // Calculate stats for each player's last 3 matches
  const playerStats: PlayerStats[] = playersWithEnoughMatches.map(player => {
    const matches = player.matches;
    const totalRounds = matches.reduce((sum, m) => sum + m.match.rounds, 0);
    
    const stats = matches.reduce((acc, match) => ({
      kills: acc.kills + match.kills,
      deaths: acc.deaths + match.deaths,
      damage: acc.damage + match.damage,
      avgCombatScore: acc.avgCombatScore + match.avgCombatScore,
      wins: acc.wins + (match.won ? 1 : 0),
    }), {
      kills: 0,
      deaths: 0,
      damage: 0,
      avgCombatScore: 0,
      wins: 0,
    });

    const kd = stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills;
    const adr = totalRounds > 0 ? stats.damage / totalRounds : 0;
    const acs = stats.avgCombatScore / 3; // Average across 3 matches
    const winRate = (stats.wins / 3) * 100;

    return {
      playerId: player.id,
      puuid: player.puuid,
      name: player.name,
      tag: player.tag,
      kd,
      adr,
      acs,
      winRate,
    };
  });

  // Calculate z-scores for each metric
  const kdMean = playerStats.reduce((sum, p) => sum + p.kd, 0) / playerStats.length;
  const adrMean = playerStats.reduce((sum, p) => sum + p.adr, 0) / playerStats.length;
  const acsMean = playerStats.reduce((sum, p) => sum + p.acs, 0) / playerStats.length;
  const winRateMean = playerStats.reduce((sum, p) => sum + p.winRate, 0) / playerStats.length;

  const kdStdDev = Math.sqrt(
    playerStats.reduce((sum, p) => sum + Math.pow(p.kd - kdMean, 2), 0) / playerStats.length
  );
  const adrStdDev = Math.sqrt(
    playerStats.reduce((sum, p) => sum + Math.pow(p.adr - adrMean, 2), 0) / playerStats.length
  );
  const acsStdDev = Math.sqrt(
    playerStats.reduce((sum, p) => sum + Math.pow(p.acs - acsMean, 2), 0) / playerStats.length
  );
  const winRateStdDev = Math.sqrt(
    playerStats.reduce((sum, p) => sum + Math.pow(p.winRate - winRateMean, 2), 0) / playerStats.length
  );

  // Calculate composite scores and assign tiers
  const tierListPlayers: TierListPlayer[] = playerStats.map(player => {
    const kdZ = kdStdDev > 0 ? (player.kd - kdMean) / kdStdDev : 0;
    const adrZ = adrStdDev > 0 ? (player.adr - adrMean) / adrStdDev : 0;
    const acsZ = acsStdDev > 0 ? (player.acs - acsMean) / acsStdDev : 0;
    const winRateZ = winRateStdDev > 0 ? (player.winRate - winRateMean) / winRateStdDev : 0;

    // Composite formula: 0.45*KD + 0.25*ADR + 0.20*ACS + 0.10*Win%
    const compositeScore = 0.45 * kdZ + 0.25 * adrZ + 0.20 * acsZ + 0.10 * winRateZ;

    // Determine tier based on composite score
    let tier: 'S' | 'A' | 'B' | 'C' | 'D';
    if (compositeScore >= 1.0) {
      tier = 'S';
    } else if (compositeScore >= 0.3) {
      tier = 'A';
    } else if (compositeScore >= -0.3) {
      tier = 'B';
    } else if (compositeScore >= -1.0) {
      tier = 'C';
    } else {
      tier = 'D';
    }

    return {
      playerId: player.playerId,
      puuid: player.puuid,
      name: player.name,
      tag: player.tag,
      tier,
      compositeScore: Math.round(compositeScore * 1000) / 1000,
      last3GamesKd: Math.round(player.kd * 100) / 100,
      last3GamesAdr: Math.round(player.adr),
      last3GamesAcs: Math.round(player.acs),
      last3GamesWinRate: Math.round(player.winRate * 10) / 10,
    };
  });

  // Sort by composite score (highest first)
  return tierListPlayers.sort((a, b) => b.compositeScore - a.compositeScore);
}