import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import AnimatedCard from './AnimatedCard';
import TrickHistory from './TrickHistory';

const PlayArea: React.FC = () => {
  const { currentTrick, trumpSuit } = useSelector((state: RootState) => state.game);

  const getCardPosition = (index: number) => {
    switch (index) {
      case 0: // Sud
        return { x: 0, y: 100 };
      case 1: // Est
        return { x: 100, y: 0 };
      case 2: // Nord
        return { x: 0, y: -100 };
      case 3: // Ouest
        return { x: -100, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative w-96 h-96">
        {currentTrick.map((card, index) => (
          <AnimatedCard
            key={`${card.suit}-${card.value}`}
            card={card}
            position={getCardPosition(index)}
            rotation={index * 90}
          />
        ))}
        
        {trumpSuit && (
          <div className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-lg">
            <span className={`text-2xl ${trumpSuit === '♥' || trumpSuit === '♦' ? 'text-red-600' : 'text-black'}`}>
              {trumpSuit}
            </span>
          </div>
        )}
      </div>

      <TrickHistory />
    </div>
  );
};

export default PlayArea;