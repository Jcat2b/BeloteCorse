import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const PlayArea: React.FC = () => {
  const { currentTrick, trumpSuit } = useSelector((state: RootState) => state.game);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative w-96 h-96">
        {currentTrick.map((card, index) => (
          <div
            key={`${card.suit}-${card.value}`}
            className={`absolute w-24 h-36 transform
              ${index === 0 ? 'top-1/2 -translate-y-1/2' : ''}
              ${index === 1 ? 'right-0 top-1/2 -translate-y-1/2' : ''}
              ${index === 2 ? 'bottom-0 left-1/2 -translate-x-1/2' : ''}
              ${index === 3 ? 'left-0 top-1/2 -translate-y-1/2' : ''}`}
          >
            <div className={`w-full h-full rounded-lg shadow-lg bg-white flex items-center justify-center
              text-2xl font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>
              <span>{card.value}</span>
              <span>{card.suit}</span>
            </div>
          </div>
        ))}
        {trumpSuit && (
          <div className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-lg">
            <span className={`text-2xl ${trumpSuit === '♥' || trumpSuit === '♦' ? 'text-red-600' : 'text-black'}`}>
              {trumpSuit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayArea;