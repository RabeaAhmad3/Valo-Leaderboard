'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function UpdateGameForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/addMatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add match');
      }

      // Success - redirect to leaderboard
      router.push('/leaderboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            Tracker.gg Match URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://tracker.gg/valorant/match/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            required
            disabled={isLoading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Example: https://tracker.gg/valorant/match/320b7150-9769-492a-a8ad-e31d95818838
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Update Game'
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">How it works:</h3>
        <ol className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start">
            <span className="text-red-500 font-bold mr-2">1.</span>
            Go to Tracker.gg and find your match
          </li>
          <li className="flex items-start">
            <span className="text-red-500 font-bold mr-2">2.</span>
            Copy the match URL from your browser
          </li>
          <li className="flex items-start">
            <span className="text-red-500 font-bold mr-2">3.</span>
            Paste it above and click Update Game
          </li>
          <li className="flex items-start">
            <span className="text-red-500 font-bold mr-2">4.</span>
            View updated stats on the leaderboard!
          </li>
        </ol>
      </div>
    </div>
  );
}