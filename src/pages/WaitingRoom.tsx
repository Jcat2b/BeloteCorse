import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Plus } from 'lucide-react';

const WaitingRoom: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const createGame = () => {
    const newGameId = `game-${Date.now()}`;
    navigate(`/game/${newGameId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-8">Bienvenue sur Belote Corse</h1>
        
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-8">
            Aucune partie n'est en cours. Créez une nouvelle table pour commencer à jouer !
          </p>
          
          <button
            onClick={createGame}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="h-6 w-6" />
            Créer une nouvelle table
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;