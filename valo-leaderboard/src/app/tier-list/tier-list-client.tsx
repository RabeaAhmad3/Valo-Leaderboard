'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TierListPlayer } from '@/types/leaderboard';
import { PlayerCard } from './components/player-card';
import { TierRow } from './components/tier-row';

interface TierListClientProps {
  initialTiers: Record<'S' | 'A' | 'B' | 'C' | 'D', TierListPlayer[]>;
}

export function TierListClient({ initialTiers }: TierListClientProps) {
  const [tiers, setTiers] = useState(initialTiers);
  const [activePlayer, setActivePlayer] = useState<TierListPlayer | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const playerId = active.id as number;
    
    // Find the player being dragged
    let foundPlayer: TierListPlayer | null = null;
    Object.values(tiers).forEach(tierPlayers => {
      const player = tierPlayers.find(p => p.playerId === playerId);
      if (player) foundPlayer = player;
    });
    
    setActivePlayer(foundPlayer);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePlayer(null);

    if (!over) return;

    const playerId = active.id as number;
    const newTier = over.id as 'S' | 'A' | 'B' | 'C' | 'D';

    // Find current tier of the player
    let currentTier: 'S' | 'A' | 'B' | 'C' | 'D' | null = null;
    let player: TierListPlayer | null = null;

    Object.entries(tiers).forEach(([tier, players]) => {
      const foundPlayer = players.find(p => p.playerId === playerId);
      if (foundPlayer) {
        currentTier = tier as 'S' | 'A' | 'B' | 'C' | 'D';
        player = foundPlayer;
      }
    });

    if (!currentTier || !player || currentTier === newTier) return;

    // Move player to new tier
    setTiers(prev => {
      const newTiers = { ...prev };
      newTiers[currentTier as keyof typeof newTiers] = prev[currentTier as keyof typeof prev].filter(p => p.playerId !== playerId);
      newTiers[newTier] = [...prev[newTier], player!];
      return newTiers;
    });
  };

  const tierConfigs = [
    { tier: 'S' as const, label: 'S Tier', color: 'from-yellow-400 to-yellow-500', textColor: 'text-yellow-900' },
    { tier: 'A' as const, label: 'A Tier', color: 'from-green-400 to-green-500', textColor: 'text-green-900' },
    { tier: 'B' as const, label: 'B Tier', color: 'from-blue-400 to-blue-500', textColor: 'text-blue-900' },
    { tier: 'C' as const, label: 'C Tier', color: 'from-purple-400 to-purple-500', textColor: 'text-purple-900' },
    { tier: 'D' as const, label: 'D Tier', color: 'from-red-400 to-red-500', textColor: 'text-red-900' },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {tierConfigs.map(config => (
          <TierRow
            key={config.tier}
            tier={config.tier}
            label={config.label}
            color={config.color}
            textColor={config.textColor}
            players={tiers[config.tier]}
          />
        ))}
      </div>

      <DragOverlay>
        {activePlayer ? (
          <PlayerCard player={activePlayer} isDragging />
        ) : null}
      </DragOverlay>

      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-sm text-center">
          💡 Drag players between tiers to create your own ranking! 
          Hover over players to see their stats. Rankings reset when you refresh the page.
        </p>
      </div>
    </DndContext>
  );
}