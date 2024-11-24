import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { GameBoard } from '../components/game';
import GameChat from '../components/game/GameChat';

const GameRoom: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !gameId) return null;

  return (
    <div className="h-screen flex">
      <div className="flex-1">
        <GameBoard />
      </div>
      <div className="w-80 border-l border-gray-200">
        <GameChat gameId={gameId} />
      </div>
    </div>
  );
};

export default GameRoom;