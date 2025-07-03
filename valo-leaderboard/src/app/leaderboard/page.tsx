import Link from 'next/link';
import { getLeaderboardData } from './actions';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  let leaderboardData;
  try {
    leaderboardData = await getLeaderboardData();
  } catch (error) {
    console.error('Error loading leaderboard data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error Loading Leaderboard</h1>
          <p className="text-gray-400">Unable to connect to database. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Leaderboard
            </h1>
            <p className="text-gray-400">
              Overall player statistics across all matches
            </p>
          </div>

          {leaderboardData.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400">No matches recorded yet</p>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900/50 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        W-L
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Win %
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        K
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        D
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        A
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        KD
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Avg ACS
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        HS %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {leaderboardData.map((player) => (
                      <tr
                        key={player.puuid}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-2xl font-bold ${
                            player.rank === 1 ? 'text-yellow-400' :
                            player.rank === 2 ? 'text-gray-300' :
                            player.rank === 3 ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            #{player.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/player/${player.puuid}`}
                            className="group"
                          >
                            <div className="text-white font-medium group-hover:text-red-400 transition-colors">
                              {player.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              #{player.tag}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                          <span className="text-green-400">{player.wins}</span>
                          <span className="text-gray-500">-</span>
                          <span className="text-red-400">{player.losses}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`font-medium ${
                            player.winRate >= 60 ? 'text-green-400' :
                            player.winRate >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {player.winRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                          {player.kills}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                          {player.deaths}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                          {player.assists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`font-medium ${
                            player.kd >= 1.5 ? 'text-green-400' :
                            player.kd >= 1.0 ? 'text-green-600' :
                            player.kd >= 0.8 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {player.kd}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-white">
                          {player.avgAcs}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`font-medium ${
                            player.headshotPercent >= 20 ? 'text-green-400' :
                            player.headshotPercent >= 14 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {player.headshotPercent}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/tier-list"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              View Tier List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}