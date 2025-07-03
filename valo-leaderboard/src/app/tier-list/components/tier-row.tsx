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
        w-20 h-20 rounded-l-lg bg-gradient-to-br ${color} 
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
          flex-1 min-h-20 bg-gray-800/50 border-2 border-dashed rounded-r-lg p-2
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
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {players.map(player => (
              <PlayerCard key={player.playerId} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}