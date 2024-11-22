import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Trophy, Target, Zap, Award } from 'lucide-react';

const PlayerStats: React.FC = () => {
  const { playerStats } = useSelector((state: RootState) => state.social);

  if (!playerStats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Aucune statistique disponible</p>
      </div>
    );
  }

  const winRate = Math.round((playerStats.gamesWon / playerStats.totalGames) * 100) || 0;
  const contractSuccessRate = Math.round(
    (playerStats.successfulContracts / playerStats.totalContracts) * 100
  ) || 0;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Statistiques</h2>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-primary-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-primary-600" />
            <h3 className="font-semibold">Performance globale</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Parties jouées</p>
              <p className="text-2xl font-bold">{playerStats.totalGames}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux de victoire</p>
              <p className="text-2xl font-bold">{winRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Contrats</h3>
          </div>
          <p className="text-sm text-gray-600">Taux de réussite</p>
          <p className="text-xl font-bold">{contractSuccessRate}%</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold">Plus haut contrat</h3>
          </div>
          <p className="text-sm text-gray-600">Points</p>
          <p className="text-xl font-bold">{playerStats.highestContract}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Coinches</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Réussies</span>
              <span className="font-bold">{playerStats.coinches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Surcoinches</span>
              <span className="font-bold">{playerStats.surcoinches}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;