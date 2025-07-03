'use server';

import { prisma } from '@/lib/prisma';
import { calculatePlayerStats, calculatePlayerBadges } from '@/utils/stats-calculator';
import { PlayerStats, AgentStats, MapStats, KillMatrixEntry } from '@/types/leaderboard';
import { BADGES } from '@/types/badges';
import { PlayerBadge } from '@/types/player-profile';

export async function getPlayerData(puuid: string) {
  const player = await prisma.player.findUnique({
    where: { puuid },
    include: {
      matches: {
        include: {
          match: true,
        },
        orderBy: {
          match: {
            startedAt: 'desc',
          },
        },
      },
    },
  });

  if (!player) {
    return null;
  }

  return player;
}

export async function getPlayerStats(playerId: number): Promise<PlayerStats> {
  const stats = await calculatePlayerStats(playerId);
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new Error('Player not found');
  }

  return {
    playerId,
    puuid: player.puuid,
    name: player.name,
    tag: player.tag,
    ...stats,
  };
}

export async function getPlayerBadges(playerId: number): Promise<PlayerBadge[]> {
  const badgeIds = await calculatePlayerBadges(playerId);
  const badges = BADGES.filter(badge => badgeIds.includes(badge.id))
    .map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      type: badge.type,
      // Remove the condition function as it can't be serialized
    }));
  return badges;
}

export async function getAgentStats(playerId: number): Promise<AgentStats[]> {
  const matches = await prisma.matchPlayer.findMany({
    where: { playerId },
    include: { match: true },
  });

  // Group by agent
  const agentMap = new Map<string, {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    avgCombatScore: number;
  }>();

  matches.forEach(match => {
    const current = agentMap.get(match.agent) || {
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      avgCombatScore: 0,
    };

    current.games++;
    if (match.won) current.wins++;
    current.kills += match.kills;
    current.deaths += match.deaths;
    current.avgCombatScore += match.avgCombatScore;

    agentMap.set(match.agent, current);
  });

  const agentStats: AgentStats[] = Array.from(agentMap.entries())
    .map(([agent, stats]) => ({
      agent,
      games: stats.games,
      wins: stats.wins,
      winRate: Math.round((stats.wins / stats.games) * 1000) / 10,
      kd: Math.round((stats.kills / (stats.deaths || 1)) * 100) / 100,
      avgAcs: Math.round(stats.avgCombatScore / stats.games),
    }))
    // Show all agents (no minimum game requirement)
    .sort((a, b) => b.games - a.games);

  return agentStats;
}

export async function getMapStats(playerId: number): Promise<MapStats[]> {
  const matches = await prisma.matchPlayer.findMany({
    where: { playerId },
    include: { match: true },
  });

  // Group by map
  const mapData = new Map<string, {
    games: number;
    wins: number;
    kills: number;
    deaths: number;
    avgCombatScore: number;
  }>();

  matches.forEach(match => {
    const current = mapData.get(match.match.map) || {
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      avgCombatScore: 0,
    };

    current.games++;
    if (match.won) current.wins++;
    current.kills += match.kills;
    current.deaths += match.deaths;
    current.avgCombatScore += match.avgCombatScore;

    mapData.set(match.match.map, current);
  });

  const mapStats: MapStats[] = Array.from(mapData.entries())
    .map(([map, stats]) => ({
      map,
      games: stats.games,
      wins: stats.wins,
      winRate: Math.round((stats.wins / stats.games) * 1000) / 10,
      kd: Math.round((stats.kills / (stats.deaths || 1)) * 100) / 100,
      avgAcs: Math.round(stats.avgCombatScore / stats.games),
    }))
    // Show all maps (no minimum game requirement)
    .sort((a, b) => b.games - a.games);

  return mapStats;
}

export async function getKillMatrix(puuid: string): Promise<KillMatrixEntry[]> {
  // Get all matches where this player participated
  const player = await prisma.player.findUnique({
    where: { puuid },
  });

  if (!player) return [];

  const playerMatches = await prisma.matchPlayer.findMany({
    where: { playerId: player.id },
    select: { matchId: true },
  });

  const matchIds = playerMatches.map(m => m.matchId);

  // Get all players from those matches
  const allMatchPlayers = await prisma.matchPlayer.findMany({
    where: {
      matchId: { in: matchIds },
    },
    include: {
      player: true,
      match: true,
    },
  });

  // Group by match and calculate kills/deaths
  const killMatrix = new Map<string, KillMatrixEntry>();

  // For each match, calculate team-based kills
  const matchGroups = allMatchPlayers.reduce((acc, mp) => {
    if (!acc[mp.matchId]) acc[mp.matchId] = [];
    acc[mp.matchId].push(mp);
    return acc;
  }, {} as Record<string, typeof allMatchPlayers>);

  Object.entries(matchGroups).forEach(([, players]) => {
    const currentPlayer = players.find(p => p.player.puuid === puuid);
    if (!currentPlayer) return;

    const currentTeam = currentPlayer.team;
    const opponents = players.filter(p => p.team !== currentTeam);

    // For simplicity, we'll distribute kills/deaths evenly among opponents
    // In a real implementation, you'd use the actual kill feed data
    opponents.forEach(opponent => {
      const key = opponent.player.puuid;
      const existing = killMatrix.get(key) || {
        killerPuuid: puuid,
        killerName: currentPlayer.player.name,
        killerTag: currentPlayer.player.tag,
        victimPuuid: opponent.player.puuid,
        victimName: opponent.player.name,
        victimTag: opponent.player.tag,
        kills: 0,
        deaths: 0,
      };

      // Estimate kills/deaths based on performance
      const killShare = currentPlayer.kills / opponents.length;
      const deathShare = opponent.kills / opponents.length;

      existing.kills += Math.round(killShare);
      existing.deaths += Math.round(deathShare);

      killMatrix.set(key, existing);
    });
  });

  return Array.from(killMatrix.values())
    .filter(entry => entry.kills > 0 || entry.deaths > 0)
    .sort((a, b) => (b.kills - b.deaths) - (a.kills - a.deaths));
}