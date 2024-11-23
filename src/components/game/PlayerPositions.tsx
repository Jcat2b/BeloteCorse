import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { User } from 'lucide-react';

const PlayerPositions: React.FC = () => {
  const { players, currentPlayer } = useSelector((state: RootState) => state.game);

  const getPlayerByPosition = (position: number) => {
    return players.find(p => p.position === position);
  };

  const getPositionClasses = (position: number) => {
    const isCurrentPlayer = players[currentPlayer]?.position === position;
    const baseClasses = "absolute flex flex-col items-center gap-1";
    const activeClasses = isCurrentPlayer ? "bg-primary-100 ring-2 ring-primary-500" : "bg-white";
    
    switch (position) {
      case 0: // Sud (bas)
        return `${baseClasses} bottom-4 left-1/2 -translate-x-1/2 ${activeClasses}`;
      case 1: // Ouest (gauche)
        return `${baseClasses} left-4 top-1/2 -translate-y-1/2 ${activeClasses}`;
      case 2: // Nord (haut)
        return `${baseClasses} top-4 left-1/2 -translate-x-1/2 ${activeClasses}`;
      case 3: // Est (droite)
        return `${baseClasses} right-4 top-1/2 -translate-y-1/2 ${activeClasses}`;
      default:
        return baseClasses;
    }
  };

  const positions = ['Sud', 'Ouest', 'Nord', 'Est'];

  return (
    <>
      {positions.map((position, index) => {
        const player = getPlayerByPosition(index);
        if (!player) return null;

        return (
          <div key={index} className={getPositionClasses(index)}>
            <div className={`p-2 rounded-lg shadow-md min-w-[120px] text-center
              ${!player.connected ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{player.name}</span>
              </div>
              <span className="text-sm text-gray-500">{position}</span>
              {player.team === 1 ? (
                <span className="text-xs text-blue-600">Équipe 1</span>
              ) : (
                <span className="text-xs text-red-600">Équipe 2</span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PlayerPositions;