import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import type { Card } from '../../types/game';
import { playCard } from '../../store/features/gameSlice';
import AnimatedCard from './AnimatedCard';

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

  const getCardPosition = (index: number, total: number) => {
    const spread = Math.min(600, total * 80); // Limite la largeur totale
    const startX = -spread / 2;
    const step = spread / (total - 1 || 1);
    const x = startX + index * step;
    const y = 0;
    
    return { x, y };
  };

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4">
      <div className="relative h-40">
        {hand.map((card, index) => (
          <AnimatedCard
            key={`${card.suit}-${card.value}`}
            card={card}
            position={getCardPosition(index, hand.length)}
            rotation={0}
            isPlayable={isPlayerTurn}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;