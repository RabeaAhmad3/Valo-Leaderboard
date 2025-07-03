import { prisma } from '@/lib/prisma';
import { BadgeStats, BADGES } from '@/types/badges';

export async function calculatePlayerStats(playerId: number) {
  const matches = await prisma.matchPlayer.findMany({
    where: { playerId },
    include: { match: true },
  });

  if (matches.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      kd: 0,
      avgAcs: 0,
      avgDamage: 0,
      headshotPercent: 0,
      firstBloods: 0,
      firstDeaths: 0,
      firstBloodShare: 0,
      plants: 0,
      defuses: 0,
      clutches: 0,
      clutchesLost: 0,
      clutchWinRate: 0,
      economyRating: 0,
      legShotPercent: 0,
    };
  }

  const totalGames = matches.length;
  const wins = matches.filter(m => m.won).length;
  const losses = totalGames - wins;
  const winRate = (wins / totalGames) * 100;

  const totals = matches.reduce((acc, match) => ({
    kills: acc.kills + match.kills,
    deaths: acc.deaths + match.deaths,
    assists: acc.assists + match.assists,
    score: acc.score + match.score,
    damage: acc.damage + match.damage,
    headshots: acc.headshots + match.headshots,
    bodyshots: acc.bodyshots + match.bodyshots,
    legshots: acc.legshots + match.legshots,
    avgCombatScore: acc.avgCombatScore + match.avgCombatScore,
    firstBloods: acc.firstBloods + match.firstBloods,
    firstDeaths: acc.firstDeaths + match.firstDeaths,
    plants: acc.plants + match.plants,
    defuses: acc.defuses + match.defuses,
    clutches: acc.clutches + match.clutches,
    clutchesLost: acc.clutchesLost + match.clutchesLost,
    econRating: acc.econRating + match.econRating,
  }), {
    kills: 0,
    deaths: 0,
    assists: 0,
    score: 0,
    damage: 0,
    headshots: 0,
    bodyshots: 0,
    legshots: 0,
    avgCombatScore: 0,
    firstBloods: 0,
    firstDeaths: 0,
    plants: 0,
    defuses: 0,
    clutches: 0,
    clutchesLost: 0,
    econRating: 0,
  });

  const totalShots = totals.headshots + totals.bodyshots + totals.legshots;
  const kd = totals.deaths > 0 ? totals.kills / totals.deaths : totals.kills;
  // Average the ACS values from each match
  const avgAcs = Math.round(totals.avgCombatScore / totalGames);
  const avgDamage = totals.damage / totalGames;
  const headshotPercent = totalShots > 0 ? (totals.headshots / totalShots) * 100 : 0;
  const legShotPercent = totalShots > 0 ? (totals.legshots / totalShots) * 100 : 0;
  const firstBloodShare = totalGames > 0 ? (totals.firstBloods / totalGames) * 100 : 0;
  const totalClutchAttempts = totals.clutches + totals.clutchesLost;
  const clutchWinRate = totalClutchAttempts > 0 ? (totals.clutches / totalClutchAttempts) * 100 : 0;
  const economyRating = totals.econRating / totalGames;

  return {
    totalGames,
    wins,
    losses,
    winRate,
    kills: totals.kills,
    deaths: totals.deaths,
    assists: totals.assists,
    kd: Math.round(kd * 100) / 100,
    avgAcs: Math.round(avgAcs),
    avgDamage: Math.round(avgDamage),
    headshotPercent: Math.round(headshotPercent * 10) / 10,
    firstBloods: totals.firstBloods,
    firstDeaths: totals.firstDeaths,
    firstBloodShare: Math.round(firstBloodShare * 10) / 10,
    plants: totals.plants,
    defuses: totals.defuses,
    clutches: totals.clutches,
    clutchesLost: totals.clutchesLost,
    clutchWinRate: Math.round(clutchWinRate * 10) / 10,
    economyRating: Math.round(economyRating * 100) / 100,
    legShotPercent: Math.round(legShotPercent * 10) / 10,
  };
}

export async function calculatePlayerBadges(playerId: number): Promise<string[]> {
  const stats = await calculatePlayerStats(playerId);
  
  // Get all players' stats for percentile calculations
  const allPlayers = await prisma.player.findMany({
    include: {
      matches: true,
    },
  });

  // Calculate stats for all players
  const allPlayerStats = await Promise.all(
    allPlayers.map(player => calculatePlayerStats(player.id))
  );

  // Sort by K/D
  const sortedKd = allPlayerStats
    .map(p => p.kd)
    .sort((a, b) => b - a);
  const kdRank = sortedKd.findIndex(kd => kd <= stats.kd) + 1;
  const kdPercentile = ((sortedKd.length - kdRank + 1) / sortedKd.length) * 100;

  // Sort by Win Rate
  const sortedWinRate = allPlayerStats
    .map(p => p.winRate)
    .sort((a, b) => b - a);
  const winRateRank = sortedWinRate.findIndex(wr => wr <= stats.winRate) + 1;
  const winRatePercentile = ((sortedWinRate.length - winRateRank + 1) / sortedWinRate.length) * 100;

  // Sort by ACS
  const sortedAcs = allPlayerStats
    .map(p => p.avgAcs)
    .sort((a, b) => b - a);
  const acsRank = sortedAcs.findIndex(acs => acs <= stats.avgAcs) + 1;
  const acsPercentile = ((sortedAcs.length - acsRank + 1) / sortedAcs.length) * 100;

  // Get all players' clutches to determine who has the most
  const allPlayersClutches = await prisma.matchPlayer.groupBy({
    by: ['playerId'],
    _sum: {
      clutches: true,
    },
  });

  const maxClutches = Math.max(...allPlayersClutches.map(p => p._sum.clutches || 0));
  const playerTotalClutches = allPlayersClutches.find(p => p.playerId === playerId)?._sum.clutches || 0;
  const hasMostClutches = playerTotalClutches > 0 && playerTotalClutches === maxClutches;

  const badgeStats: BadgeStats = {
    kd: stats.kd,
    headshotPercent: stats.headshotPercent,
    clutches: stats.clutches,
    clutchWinRate: stats.clutchWinRate,
    economyRating: stats.economyRating,
    firstBloodShare: stats.firstBloodShare,
    plants: stats.plants,
    defuses: stats.defuses,
    totalGames: stats.totalGames,
    legShotPercent: stats.legShotPercent,
    avgAcs: stats.avgAcs,
    isBottomFrag: acsPercentile <= 10, // Bottom 10%
    isBottomestFrag: acsRank === sortedAcs.length,
    hasMostClutches,
    kdPercentile,
    winRatePercentile,
    acsPercentile,
  };

  const earnedBadges = BADGES
    .filter(badge => badge.condition(badgeStats))
    .map(badge => badge.id);

  return earnedBadges;
}

export async function updateAllPlayerStats() {
  const players = await prisma.player.findMany();
  
  for (const player of players) {
    await calculatePlayerBadges(player.id);
    // In a real app, we'd store these badges in a separate table
    // For now, we'll just calculate them on-demand
  }
}