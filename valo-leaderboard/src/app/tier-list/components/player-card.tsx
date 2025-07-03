'use client';

import { useDraggable } from '@dnd-kit/core';
import { TierListPlayer } from '@/types/leaderboard';
import Link from 'next/link';
import { useState } from 'react';
import { getAgentIcon } from '@/utils/agent-icons';

interface PlayerCardProps {
  player: TierListPlayer;
  isDragging?: boolean;
}

export function PlayerCard({ player, isDragging = false }: PlayerCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isCurrentlyDragging,
  } = useDraggable({
    id: player.playerId,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const cardContent = (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-gray-800 rounded-lg p-2 border border-gray-600 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:border-gray-500 hover:shadow-lg
        ${isCurrentlyDragging || isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${isDragging ? 'shadow-2xl' : ''}
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mx-auto mb-1 flex items-center justify-center border border-gray-600">
          <span className="text-lg">
            {getAgentIcon(player.bestAgent)}
          </span>
        </div>
        <div className="text-white font-semibold text-xs">
          {player.name}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && !isDragging && !isCurrentlyDragging && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-xl min-w-48">
          <div className="text-white font-semibold text-sm mb-2 text-center">
            {player.name}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">K/D:</span>
              <span className={`font-medium ${
                player.last3GamesKd >= 1.5 ? 'text-green-400' :
                player.last3GamesKd >= 1.0 ? 'text-green-600' :
                player.last3GamesKd >= 0.8 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {player.last3GamesKd}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ADR:</span>
              <span className="text-white">{player.last3GamesAdr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ACS:</span>
              <span className="text-white">{player.last3GamesAcs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Win%:</span>
              <span className={`font-medium ${
                player.last3GamesWinRate >= 60 ? 'text-green-400' :
                player.last3GamesWinRate >= 50 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {player.last3GamesWinRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Score:</span>
              <span className="text-blue-400">{player.compositeScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Games:</span>
              <span className="text-gray-300">{player.gamesUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Agent:</span>
              <span className="text-gray-300">{getAgentIcon(player.bestAgent)} {player.bestAgent}</span>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-600"></div>
        </div>
      )}
    </div>
  );

  // If dragging, return just the card without link
  if (isDragging || isCurrentlyDragging) {
    return cardContent;
  }

  // Otherwise, wrap with link for navigation
  return (
    <Link href={`/player/${player.puuid}`} className="block">
      {cardContent}
    </Link>
  );
}