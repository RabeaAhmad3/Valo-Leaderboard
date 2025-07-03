import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Valo Leaderboard
        </h1>
        <div className="space-y-4">
          <Link 
            href="/leaderboard"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Leaderboard
          </Link>
          <Link 
            href="/tier-list"
            className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Tier List
          </Link>
        </div>
      </div>
    </div>
  );
}