import { KillMatrixEntry } from '@/types/leaderboard';

interface KillMatrixProps {
  data: KillMatrixEntry[];
  currentPlayer: string;
}

function getIntensityColor(kills: number, deaths: number, maxValue: number): string {
  const ratio = kills / (deaths || 1);
  const intensity = Math.min(Math.max(kills + deaths, 1), maxValue) / maxValue;
  
  if (ratio > 1.5) {
    // Green for good performance
    return `bg-green-500/${Math.round(intensity * 100)}`;
  } else if (ratio > 0.8) {
    // Yellow for neutral
    return `bg-yellow-500/${Math.round(intensity * 100)}`;
  } else {
    // Red for poor performance
    return `bg-red-500/${Math.round(intensity * 100)}`;
  }
}

export function KillMatrix({ data, currentPlayer }: KillMatrixProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Kill Matrix</h2>
        <p className="text-gray-400 text-center py-8">
          No opponent data available yet
        </p>
      </div>
    );
  }

  const maxInteractions = Math.max(...data.map(d => d.kills + d.deaths));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Kill Matrix</h2>
        <p className="text-gray-400">
          Head-to-head performance vs opponents ({currentPlayer})
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(data.length, 6)}, 1fr)` }}>
            {data.slice(0, 18).map((entry) => {
              const kdRatio = entry.kills / (entry.deaths || 1);
              const total = entry.kills + entry.deaths;
              
              return (
                <div
                  key={entry.victimPuuid}
                  className={`
                    relative p-4 rounded-lg border border-gray-600 transition-all hover:scale-105 cursor-help
                    ${getIntensityColor(entry.kills, entry.deaths, maxInteractions)}
                  `}
                  title={`${entry.victimName}#${entry.victimTag}: ${entry.kills}K/${entry.deaths}D (${kdRatio.toFixed(2)} K/D)`}
                >
                  <div className="text-center">
                    <div className="text-white font-bold text-sm mb-1 truncate">
                      {entry.victimName}
                    </div>
                    <div className="text-xs text-gray-300 mb-2">
                      #{entry.victimTag}
                    </div>
                    <div className="space-y-1">
                      <div className="text-green-300 font-semibold">
                        {entry.kills}K
                      </div>
                      <div className="text-red-300 font-semibold">
                        {entry.deaths}D
                      </div>
                      <div className={`text-xs font-medium ${
                        kdRatio >= 1.5 ? 'text-green-400' :
                        kdRatio >= 1.0 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {kdRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Intensity indicator */}
                  <div className="absolute top-1 right-1">
                    <div className={`w-2 h-2 rounded-full ${
                      total >= maxInteractions * 0.7 ? 'bg-white' :
                      total >= maxInteractions * 0.3 ? 'bg-gray-300' :
                      'bg-gray-500'
                    }`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {data.length > 18 && (
            <div className="mt-4 text-center text-gray-400 text-sm">
              Showing top 18 opponents ({data.length} total)
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-400">
            Color intensity = interaction frequency
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-400">Dominated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-400">Even</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-400">Struggling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}