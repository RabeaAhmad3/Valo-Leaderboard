import { PlayerStats } from '@/types/leaderboard';

interface HeroStatsProps {
  stats: PlayerStats;
}

export function HeroStats({ stats }: HeroStatsProps) {
  const tiles = [
    {
      label: 'Games Played',
      value: stats.totalGames,
      subtext: `${stats.wins}W - ${stats.losses}L`,
      color: 'from-blue-600 to-blue-700',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      subtext: 'Overall',
      color: stats.winRate >= 50 ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700',
    },
    {
      label: 'K/D Ratio',
      value: stats.kd.toFixed(2),
      subtext: `${stats.kills}/${stats.deaths}`,
      color: stats.kd >= 1.5 ? 'from-green-500 to-green-600' :
             stats.kd >= 1.0 ? 'from-green-700 to-green-800' :
             stats.kd >= 0.8 ? 'from-yellow-600 to-yellow-700' :
             'from-red-600 to-red-700',
    },
    {
      label: 'Avg ACS',
      value: Math.round(stats.avgAcs),
      subtext: 'Per game',
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      label: 'Headshot %',
      value: `${stats.headshotPercent}%`,
      subtext: 'Accuracy',
      color: stats.headshotPercent >= 20 ? 'from-green-600 to-green-700' :
             stats.headshotPercent >= 14 ? 'from-yellow-600 to-yellow-700' :
             'from-red-600 to-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className={`bg-gradient-to-br ${tile.color} rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform`}
        >
          <div className="text-3xl font-bold mb-1">{tile.value}</div>
          <div className="text-sm opacity-90">{tile.label}</div>
          <div className="text-xs opacity-75 mt-1">{tile.subtext}</div>
        </div>
      ))}
    </div>
  );
}