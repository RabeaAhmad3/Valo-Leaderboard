'use client';

import { Badge } from '@/types/badges';
import { useState } from 'react';

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  if (badges.length === 0) {
    return null;
  }

  const seriousBadges = badges.filter(b => b.type === 'serious');
  const trollBadges = badges.filter(b => b.type === 'troll');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Badges</h2>
      
      <div className="space-y-6">
        {seriousBadges.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {seriousBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="relative"
                  onMouseEnter={() => setHoveredBadge(badge.id)}
                  onMouseLeave={() => setHoveredBadge(null)}
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg px-4 py-2 text-white font-medium shadow-lg cursor-help">
                    {badge.name}
                  </div>
                  {hoveredBadge === badge.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10 shadow-xl">
                      {badge.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {trollBadges.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-3">Hall of Shame</h3>
            <div className="flex flex-wrap gap-3">
              {trollBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="relative"
                  onMouseEnter={() => setHoveredBadge(badge.id)}
                  onMouseLeave={() => setHoveredBadge(null)}
                >
                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg px-4 py-2 text-white font-medium shadow-lg cursor-help">
                    {badge.name}
                  </div>
                  {hoveredBadge === badge.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10 shadow-xl">
                      {badge.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}