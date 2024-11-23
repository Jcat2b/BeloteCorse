import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GameBoard } from '../components/game';
import GameChat from '../components/game/GameChat';
import { initializeGame } from '../store/features/gameSlice';
import type { RootState } from '../store';

const GameRoom: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user && gameId) {
      dispatch(initializeGame({
        currentPlayerId: user.uid,
        gameId,
        playerName: user.displayName || 'Anonyme'
      }));
    }
  }, [dispatch, gameId, user]);

  return (
    <div className="h-screen flex">
      <div className="flex-1">
        <GameBoard />
      </div>
      <div className="w-80 border-l border-gray-200">
        <GameChat gameId={gameId!} />
      </div>
    </div>
  );
};

export default GameRoom;