import { notFound } from 'next/navigation';
import { 
  getPlayerData, 
  getPlayerStats, 
  getPlayerBadges,
  getAgentStats,
  getMapStats,
  getKillMatrix 
} from './actions';
import { HeroStats } from './components/hero-stats';
import { BadgeDisplay } from './components/badge-display';
import { AgentMapStats } from './components/agent-map-stats';
import { KillMatrix } from './components/kill-matrix';

interface PlayerPageProps {
  params: Promise<{ puuid: string }>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { puuid } = await params;
  const player = await getPlayerData(puuid);

  if (!player) {
    notFound();
  }

  const [stats, badges, agentStats, mapStats, killMatrix] = await Promise.all([
    getPlayerStats(player.id),
    getPlayerBadges(player.id),
    getAgentStats(player.id),
    getMapStats(player.id),
    getKillMatrix(puuid),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Player Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-2">
              {player.name}
              <span className="text-gray-500 text-3xl">#{player.tag}</span>
            </h1>
            <p className="text-gray-400">
              Player statistics from {stats.totalGames} games
            </p>
          </div>

          {/* Hero Stats */}
          <HeroStats stats={stats} />

          {/* Badges */}
          <BadgeDisplay badges={badges} />

          {/* Agent & Map Stats */}
          <AgentMapStats 
            agentStats={agentStats} 
            mapStats={mapStats} 
          />

          {/* Kill Matrix */}
          <KillMatrix data={killMatrix} currentPlayer={player.name} />
        </div>
      </div>
    </div>
  );
}