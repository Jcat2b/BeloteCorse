import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { Trophy, Star, BarChart2, Users, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { initializeGame } from '../../store/features/gameSlice';
import { updatePlayerStats } from '../../store/features/socialSlice';

const GameEndScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { score, tricks, players, contract } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const winningTeam = score.team1 > score.team2 ? 1 : 2;
  const currentPlayer = players.find(p => p.id === currentUser?.uid);
  const hasWon = currentPlayer?.team === winningTeam;

  const gameStats = {
    totalPoints: score.team1 + score.team2,
    highestTrick: Math.max(...tricks.map(t => t.points)),
    contractSuccess: score[`team${contract.team}`] >= contract.points,
    tricksByTeam: tricks.reduce(
      (acc, t) => {
        acc[`team${t.winner}`]++;
        return acc;
      },
      { team1: 0, team2: 0 }
    ),
  };

  const handleRematch = () => {
    if (!currentUser) return;
    
    dispatch(updatePlayerStats({
      totalGames: 1,
      gamesWon: hasWon ? 1 : 0,
      totalPoints: gameStats.totalPoints,
      highestContract: contract.points,
      successfulContracts: gameStats.contractSuccess ? 1 : 0,
      totalContracts: 1,
    }));

    dispatch(initializeGame({
      currentPlayerId: currentUser.uid,
      gameId: `game-${Date.now()}`,
      playerName: currentUser.displayName || 'Anonyme'
    }));
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="p-6 text-center border-b">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {hasWon ? (
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            ) : (
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            )}
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">
            {hasWon ? 'Victoire !' : 'Défaite'}
          </h2>
          <p className="text-xl text-gray-600">
            Score final : {score.team1} - {score.team2}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <BarChart2 className="h-5 w-5" />
                <span>Points totaux</span>
              </div>
              <p className="text-2xl font-bold">{gameStats.totalPoints}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Trophy className="h-5 w-5" />
                <span>Plus gros pli</span>
              </div>
              <p className="text-2xl font-bold">{gameStats.highestTrick}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-5 w-5" />
                <span>Contrat</span>
              </div>
              <p className="text-2xl font-bold">
                {contract.points} {contract.suit}
                <span className="text-sm text-gray-500 ml-2">
                  ({gameStats.contractSuccess ? 'Réussi' : 'Échoué'})
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>Plis gagnés</span>
              </div>
              <p className="text-2xl font-bold">
                {gameStats.tricksByTeam.team1} - {gameStats.tricksByTeam.team2}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRematch}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2"
            >
              <RotateCw className="h-5 w-5" />
              Revanche
            </button>
            
            <button
              onClick={handleExit}
              className="flex-1 btn bg-gray-600 text-white hover:bg-gray-700"
            >
              Quitter
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameEndScreen;