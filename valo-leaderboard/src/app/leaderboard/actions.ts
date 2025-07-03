'use server';

import { prisma } from '@/lib/prisma';
import { LeaderboardEntry } from '@/types/leaderboard';

export async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  const players = await prisma.player.findMany({
    include: {
      matches: {
        include: {
          match: true,
        },
      },
    },
  });

  const leaderboardEntries: LeaderboardEntry[] = players
    .map((player) => {
      const matches = player.matches;
      const games = matches.length;
      
      if (games === 0) {
        return null;
      }

      const wins = matches.filter(m => m.won).length;
      const losses = games - wins;
      const winRate = (wins / games) * 100;

      const totals = matches.reduce((acc, match) => ({
        kills: acc.kills + match.kills,
        deaths: acc.deaths + match.deaths,
        assists: acc.assists + match.assists,
        avgCombatScore: acc.avgCombatScore + match.avgCombatScore,
        headshots: acc.headshots + match.headshots,
        bodyshots: acc.bodyshots + match.bodyshots,
        legshots: acc.legshots + match.legshots,
      }), {
        kills: 0,
        deaths: 0,
        assists: 0,
        avgCombatScore: 0,
        headshots: 0,
        bodyshots: 0,
        legshots: 0,
      });

      const kd = totals.deaths > 0 ? totals.kills / totals.deaths : totals.kills;
      const avgAcs = totals.avgCombatScore / games;
      const totalShots = totals.headshots + totals.bodyshots + totals.legshots;
      const headshotPercent = totalShots > 0 ? (totals.headshots / totalShots) * 100 : 0;

      return {
        rank: 0, // Will be set after sorting
        playerId: player.id,
        puuid: player.puuid,
        name: player.name,
        tag: player.tag,
        games,
        wins,
        losses,
        winRate: Math.round(winRate * 10) / 10,
        kills: totals.kills,
        deaths: totals.deaths,
        assists: totals.assists,
        kd: Math.round(kd * 100) / 100,
        avgAcs: Math.round(avgAcs),
        headshotPercent: Math.round(headshotPercent * 10) / 10,
      };
    })
    .filter((entry): entry is LeaderboardEntry => entry !== null)
    .sort((a, b) => {
      // Primary sort by win rate
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Secondary sort by ACS
      return b.avgAcs - a.avgAcs;
    });

  // Assign ranks
  leaderboardEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return leaderboardEntries;
}