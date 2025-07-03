'use client';

import { useDroppable } from '@dnd-kit/core';
import { TierListPlayer } from '@/types/leaderboard';
import { PlayerCard } from './player-card';

interface TierRowProps {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  label: string;
  color: string;
  textColor: string;
  players: TierListPlayer[];
}

export function TierRow({ tier, color, textColor, players }: TierRowProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: tier,
  });

  return (
    <div className="flex">
      {/* Tier Label */}
      <div className={`
        w-24 h-32 rounded-l-lg bg-gradient-to-br ${color} 
        flex items-center justify-center flex-shrink-0
      `}>
        <span className={`text-2xl font-bold ${textColor}`}>
          {tier}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-32 bg-gray-800/50 border-2 border-dashed rounded-r-lg p-4
          transition-colors duration-200
          ${isOver 
            ? 'border-blue-400 bg-blue-900/20' 
            : 'border-gray-600 hover:border-gray-500'
          }
        `}
      >
        {players.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 text-sm">
              {isOver ? 'Drop here' : 'No players in this tier'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {players.map(player => (
              <PlayerCard key={player.playerId} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}