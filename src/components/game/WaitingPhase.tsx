import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Users } from 'lucide-react';

const WaitingPhase: React.FC = () => {
  const { players } = useSelector((state: RootState) => state.game);
  const remainingPlayers = 4 - players.length;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-white/90 rounded-lg shadow-lg p-8 text-center max-w-md">
        <Users className="h-12 w-12 mx-auto mb-4 text-primary-600" />
        <h2 className="text-2xl font-bold mb-4">En attente de joueurs</h2>
        
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            {remainingPlayers > 0 
              ? `En attente de ${remainingPlayers} joueur${remainingPlayers > 1 ? 's' : ''}`
              : 'La partie va commencer...'}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < players.length ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitingPhase;