import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Clock } from 'lucide-react';
import { TURN_TIMER_DURATION } from '../../hooks/useGameTimer';

const TurnTimer: React.FC = () => {
  const { turnStartTime, currentPlayer, players, phase } = useSelector((state: RootState) => state.game);
  
  if (phase === 'WAITING' || phase === 'ENDED') return null;

  const currentPlayerName = players[currentPlayer]?.name || '';
  const elapsedTime = Math.floor((Date.now() - turnStartTime) / 1000);
  const remainingTime = Math.max(0, TURN_TIMER_DURATION - elapsedTime);

  const getTimerColor = () => {
    if (remainingTime <= 5) return 'text-red-600';
    if (remainingTime <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="absolute top-4 right-4 bg-white/90 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2">
        <Clock className={`h-5 w-5 ${getTimerColor()}`} />
        <div>
          <p className="text-sm text-gray-600">Tour de {currentPlayerName}</p>
          <p className={`text-xl font-bold ${getTimerColor()}`}>{remainingTime}s</p>
        </div>
      </div>
    </div>
  );
};

export default TurnTimer;