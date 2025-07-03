import { getTierListData } from './actions';
import { TierListClient } from './tier-list-client';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function TierListPage() {
  const { players, tiers } = await getTierListData();

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                Tier List
              </h1>
              <p className="text-gray-400 mb-8">
                Form-based ranking from last 3 games
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400">
                No match data available - add some matches to see the tier list
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Tier List
            </h1>
            <p className="text-gray-400 mb-4">
              In-form leaderboard based on recent performance (last 3 games)
            </p>
            <div className="text-sm text-gray-500">
              <p>Composite Score = 0.50×ACS + 0.20×Win% + 0.20×K/D + 0.10×Assists</p>
              <p>Tiers: S (≥+1σ), A (≥+0.3σ), B (±0.3σ), C (≤-0.3σ), D (≤-1σ)</p>
              <p>Uses last 3 games if available, or fewer for newer players</p>
            </div>
          </div>

          <TierListClient initialTiers={tiers} />
        </div>
      </div>
    </div>
  );
}