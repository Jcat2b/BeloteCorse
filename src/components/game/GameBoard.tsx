import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import PlayerHand from './PlayerHand';
import GameInfo from './GameInfo';
import PlayArea from './PlayArea';
import BiddingPhase from './BiddingPhase';

const GameBoard: React.FC = () => {
  const gameState = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  if (!gameState || !currentUser) return null;

  return (
    <div className="h-screen bg-green-800 p-4">
      <div className="relative h-full rounded-xl bg-green-700 shadow-xl p-6">
        <GameInfo />
        {gameState.phase === 'BIDDING' ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <BiddingPhase />
          </div>
        ) : (
          <>
            <PlayArea />
            <PlayerHand />
          </>
        )}
      </div>
    </div>
  );
};

export default GameBoard;