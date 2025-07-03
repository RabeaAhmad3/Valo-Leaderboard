'use client';

import { useDraggable } from '@dnd-kit/core';
import { TierListPlayer } from '@/types/leaderboard';
import Link from 'next/link';

interface PlayerCardProps {
  player: TierListPlayer;
  isDragging?: boolean;
}

export function PlayerCard({ player, isDragging = false }: PlayerCardProps) {
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
        bg-gray-800 rounded-lg p-4 border border-gray-600 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:border-gray-500 hover:shadow-lg
        ${isCurrentlyDragging || isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${isDragging ? 'shadow-2xl' : ''}
      `}
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-2 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-white font-semibold text-sm mb-1">
          {player.name}
        </div>
        <div className="text-gray-400 text-xs mb-2">
          #{player.tag}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">K/D:</span>
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
            <span className="text-gray-500">ACS:</span>
            <span className="text-white">{player.last3GamesAcs}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Win%:</span>
            <span className={`font-medium ${
              player.last3GamesWinRate >= 60 ? 'text-green-400' :
              player.last3GamesWinRate >= 50 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {player.last3GamesWinRate}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Score:</span>
            <span className="text-blue-400">{player.compositeScore}</span>
          </div>
        </div>
      </div>
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