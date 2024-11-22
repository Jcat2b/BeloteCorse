import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const GameInfo: React.FC = () => {
  const { score, contract, phase } = useSelector((state: RootState) => state.game);

  return (
    <div className="absolute top-4 left-4 bg-white/90 rounded-lg shadow-lg p-4">
      <div className="space-y-2">
        <div className="flex justify-between gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Équipe 1</h3>
            <p className="text-2xl font-bold">{score.team1}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Équipe 2</h3>
            <p className="text-2xl font-bold">{score.team2}</p>
          </div>
        </div>
        
        {contract.suit && (
          <div className="border-t pt-2">
            <h3 className="text-sm font-semibold text-gray-600">Contrat</h3>
            <p className="text-lg">
              {contract.points} - {contract.suit}
              {contract.coinched && ' (Coinché)'}
              {contract.surcoinched && ' (Surcoinché)'}
            </p>
          </div>
        )}
        
        <div className="border-t pt-2">
          <h3 className="text-sm font-semibold text-gray-600">Phase</h3>
          <p className="text-lg">{phase === 'BIDDING' ? 'Enchères' : phase === 'PLAYING' ? 'Jeu' : 'Terminé'}</p>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;