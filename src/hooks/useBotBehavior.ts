import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { pass, playCard } from '../store/features/gameSlice';
import { isValidPlay } from '../utils/gameRules';

export const useBotBehavior = () => {
  const dispatch = useDispatch();
  const { 
    currentPlayer, 
    players, 
    phase,
    currentTrick,
    trumpSuit
  } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    const currentPlayerData = players[currentPlayer];
    
    // Vérifie si c'est le tour d'un bot
    if (!currentPlayerData?.isBot) return;

    // Ajoute un délai aléatoire pour simuler une "réflexion"
    const delay = Math.random() * 1000 + 500; // Entre 500ms et 1.5s

    const timeoutId = setTimeout(() => {
      if (phase === 'BIDDING') {
        // En phase d'enchère, le bot passe toujours
        dispatch(pass());
      } else if (phase === 'PLAYING') {
        const botHand = currentPlayerData.hand;
        
        // Trouve toutes les cartes valides que le bot peut jouer
        const validCards = botHand.filter(card => 
          isValidPlay(card, botHand, currentTrick, trumpSuit)
        );

        if (validCards.length > 0) {
          // Joue une carte au hasard parmi les cartes valides
          const randomIndex = Math.floor(Math.random() * validCards.length);
          dispatch(playCard(validCards[randomIndex]));
        }
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [currentPlayer, phase, players, dispatch, currentTrick, trumpSuit]);
};