import { HenrikMatchData, Kill } from '@/types/henrik';
import { Prisma } from '@/generated/prisma';

interface ProcessedMatchData {
  match: Prisma.MatchCreateInput;
  players: ProcessedPlayer[];
}

interface ProcessedPlayer {
  playerData: {
    puuid: string;
    name: string;
    tag: string;
  };
  matchPlayerData: Omit<Prisma.MatchPlayerCreateWithoutMatchInput, 'player'>;
}

export async function processMatchData(matchData: HenrikMatchData): Promise<ProcessedMatchData> {
  console.log('Processing match data:', {
    matchId: matchData.metadata?.match_id,
    hasTeams: !!matchData.teams,
    teamsCount: matchData.teams?.length,
    playersCount: matchData.players?.length,
  });

  // Ensure teams is an array
  if (!matchData.teams || !Array.isArray(matchData.teams)) {
    throw new Error(`Invalid teams data: expected array, got ${typeof matchData.teams}`);
  }

  const redTeam = matchData.teams.find(t => t.team_id === 'Red');
  const blueTeam = matchData.teams.find(t => t.team_id === 'Blue');
  
  const match: Prisma.MatchCreateInput = {
    id: matchData.metadata.match_id,
    map: matchData.metadata.map.name,
    startedAt: new Date(matchData.metadata.started_at),
    redWon: redTeam?.won || false,
    blueWon: blueTeam?.won || false,
    rounds: redTeam ? redTeam.rounds.won + redTeam.rounds.lost : 0,
  };

  const players: ProcessedPlayer[] = matchData.players.map(player => {
    
    // Calculate special stats
    const { firstBloods, firstDeaths, plants, defuses, clutches, clutchesLost } = 
      calculateSpecialStats(player.puuid, matchData);
    
    // Determine if player won
    const playerTeam = player.team_id;
    const won = playerTeam === 'Red' ? match.redWon : match.blueWon;
    
    // Calculate average combat score
    const avgCombatScore = Math.round(player.stats.score / match.rounds);
    
    // Calculate economy rating (damage per credit spent)
    const econRating = player.economy && player.economy.spent.overall > 0 
      ? player.stats.damage.dealt / player.economy.spent.overall 
      : 0;

    return {
      playerData: {
        puuid: player.puuid,
        name: player.name,
        tag: player.tag,
      },
      matchPlayerData: {
        team: player.team_id,
        agent: player.agent.name,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        score: player.stats.score,
        damage: player.stats.damage.dealt,
        headshots: player.stats.headshots,
        bodyshots: player.stats.bodyshots,
        legshots: player.stats.legshots,
        avgCombatScore,
        econRating: Math.round(econRating * 100) / 100,
        spentCredits: player.economy?.spent.overall || 0,
        loadoutValue: player.economy?.loadout_value.overall || 0,
        firstBloods,
        firstDeaths,
        plants,
        defuses,
        clutches,
        clutchesLost,
        won,
        bottomFrag: false, // Will be calculated later
        topFrag: false, // Will be calculated later
      }
    };
  });

  // Determine top and bottom frags
  const sortedByScore = [...players].sort((a, b) => 
    b.matchPlayerData.score - a.matchPlayerData.score
  );
  
  if (sortedByScore.length > 0) {
    sortedByScore[0].matchPlayerData.topFrag = true;
    sortedByScore[sortedByScore.length - 1].matchPlayerData.bottomFrag = true;
  }

  return { match, players };
}

function calculateSpecialStats(
  puuid: string, 
  matchData: HenrikMatchData
): {
  firstBloods: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  clutches: number;
  clutchesLost: number;
} {
  let firstBloods = 0;
  let firstDeaths = 0;
  let plants = 0;
  let defuses = 0;
  let clutches = 0;
  let clutchesLost = 0;

  // Count first bloods and deaths
  if (matchData.kills) {
    const killsByRound = groupKillsByRound(matchData.kills);
    
    for (const [, kills] of killsByRound) {
      if (kills.length > 0) {
        const firstKill = kills[0];
        if (firstKill.killer.puuid === puuid) firstBloods++;
        if (firstKill.victim.puuid === puuid) firstDeaths++;
      }
    }
  }

  // Count plants and defuses
  if (matchData.rounds) {
    for (const round of matchData.rounds) {
      if (round.plant?.player.puuid === puuid) plants++;
      if (round.defuse?.player.puuid === puuid) defuses++;
      
      // Detect clutches (simplified - would need more complex logic for accurate detection)
      // This is a placeholder - real clutch detection would require analyzing alive players at specific moments
      const playerStats = round.stats?.find(s => s.player.puuid === puuid);
      if (playerStats && playerStats.stats.kills >= 2 && round.stats) {
        const teamAlive = round.stats.filter(s => 
          s.player.team === playerStats.player.team && s.stats.kills > 0
        ).length;
        if (teamAlive === 1) {
          const playerWon = round.winning_team === playerStats.player.team;
          if (playerWon) {
            clutches++;
          } else {
            clutchesLost++;
          }
        }
      }
    }
  }

  return { firstBloods, firstDeaths, plants, defuses, clutches, clutchesLost };
}

function groupKillsByRound(kills: Kill[]): Map<number, Kill[]> {
  const killsByRound = new Map<number, Kill[]>();
  
  for (const kill of kills) {
    const roundKills = killsByRound.get(kill.round) || [];
    roundKills.push(kill);
    killsByRound.set(kill.round, roundKills);
  }
  
  // Sort kills within each round by time
  for (const [, roundKills] of killsByRound) {
    roundKills.sort((a, b) => a.time_in_round_in_ms - b.time_in_round_in_ms);
  }
  
  return killsByRound;
}