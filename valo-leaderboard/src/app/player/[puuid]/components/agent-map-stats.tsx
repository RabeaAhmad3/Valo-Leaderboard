import { AgentStats, MapStats } from '@/types/leaderboard';

interface AgentMapStatsProps {
  agentStats: AgentStats[];
  mapStats: MapStats[];
}

function StatsTable({ 
  title, 
  data, 
  nameKey 
}: { 
  title: string; 
  data: (AgentStats | MapStats)[]; 
  nameKey: 'agent' | 'map';
}) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 text-center py-8">
          No data available
        </p>
      </div>
    );
  }

  const best = data.reduce((prev, current) => 
    current.winRate > prev.winRate ? current : prev
  );
  const worst = data.reduce((prev, current) => 
    current.winRate < prev.winRate ? current : prev
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex space-x-4 text-sm">
          <div className="text-green-400">
            Best: <span className="font-medium">{nameKey === 'agent' ? (best as AgentStats).agent : (best as MapStats).map}</span> ({best.winRate}%)
          </div>
          <div className="text-red-400">
            Worst: <span className="font-medium">{nameKey === 'agent' ? (worst as AgentStats).agent : (worst as MapStats).map}</span> ({worst.winRate}%)
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 font-medium py-2">
                {title.slice(0, -6)} {/* Remove " Stats" */}
              </th>
              <th className="text-center text-gray-400 font-medium py-2">Games</th>
              <th className="text-center text-gray-400 font-medium py-2">Win Rate</th>
              <th className="text-center text-gray-400 font-medium py-2">K/D</th>
              <th className="text-center text-gray-400 font-medium py-2">Avg ACS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stat) => (
              <tr key={nameKey === 'agent' ? (stat as AgentStats).agent : (stat as MapStats).map} className="border-b border-gray-700/50">
                <td className="py-3 text-white font-medium">{nameKey === 'agent' ? (stat as AgentStats).agent : (stat as MapStats).map}</td>
                <td className="py-3 text-center text-gray-300">{stat.games}</td>
                <td className="py-3 text-center">
                  <span className={`font-medium ${
                    stat.winRate >= 60 ? 'text-green-400' :
                    stat.winRate >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {stat.winRate}%
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span className={`font-medium ${
                    stat.kd >= 1.5 ? 'text-green-400' :
                    stat.kd >= 1.0 ? 'text-green-600' :
                    stat.kd >= 0.8 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {stat.kd}
                  </span>
                </td>
                <td className="py-3 text-center text-gray-300">{stat.avgAcs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AgentMapStats({ agentStats, mapStats }: AgentMapStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <StatsTable title="Agent Stats" data={agentStats} nameKey="agent" />
      <StatsTable title="Map Stats" data={mapStats} nameKey="map" />
    </div>
  );
}