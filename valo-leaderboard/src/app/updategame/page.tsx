import { UpdateGameForm } from './update-game-form';

export default function UpdateGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Update Game
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Paste a Tracker.gg match URL to add it to the leaderboard
          </p>
          
          <UpdateGameForm />
        </div>
      </div>
    </div>
  );
}