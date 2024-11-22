import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import type { Card } from '../../types/game';
import { playCard } from '../../store/features/gameSlice';

const PlayerHand: React.FC = () => {
  const dispatch = useDispatch();
  const { currentPlayer, players } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const playerIndex = players.findIndex(p => p.id === currentUser?.uid);
  const isPlayerTurn = currentPlayer === playerIndex;
  const hand = players[playerIndex]?.hand || [];

  const handleCardClick = (card: Card) => {
    if (!isPlayerTurn) return;
    dispatch(playCard(card));
  };

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4">
      <div className="flex gap-2">
        {hand.map((card, index) => (
          <button
            key={`${card.suit}-${card.value}`}
            onClick={() => handleCardClick(card)}
            disabled={!isPlayerTurn}
            className={`transform transition-transform hover:-translate-y-4 
              ${isPlayerTurn ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
          >
            <div className={`w-24 h-36 rounded-lg shadow-lg bg-white flex items-center justify-center
              text-2xl font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'}`}>
              <span>{card.value}</span>
              <span>{card.suit}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;