import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { playCard, pass, placeBid } from '../store/features/gameSlice';
import { isValidPlay } from '../utils/gameRules';
import type { Card, CardSuit } from '../types/game';

export const useBotBehavior = () => {
  const dispatch = useDispatch();
  const { 
    currentPlayer, 
    players, 
    phase,
    currentTrick,
    trumpSuit,
    contract
  } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    const currentPlayerData = players[currentPlayer];
    
    if (!currentPlayerData?.isBot) return;

    const delay = Math.random() * 1000 + 500; // Entre 500ms et 1.5s

    const timeoutId = setTimeout(() => {
      if (phase === 'BIDDING') {
        // Logique d'enchères du bot
        const shouldBid = Math.random() > 0.7; // 30% de chance de faire une enchère
        
        if (shouldBid && contract.points < 120) {
          const possibleBids = [80, 90, 100, 110, 120];
          const suits: CardSuit[] = ['♠', '♥', '♣', '♦'];
          const bid = Math.max(...possibleBids.filter(b => b > (contract.points || 0)));
          const suit = suits[Math.floor(Math.random() * suits.length)];
          
          dispatch(placeBid({
            points: bid,
            suit,
            player: currentPlayer
          }));
        } else {
          dispatch(pass());
        }
      } else if (phase === 'PLAYING') {
        const botHand = currentPlayerData.hand;
        
        // Trouve toutes les cartes valides
        const validCards = botHand.filter(card => 
          isValidPlay(card, botHand, currentTrick, trumpSuit)
        );

        if (validCards.length > 0) {
          // Stratégie simple: joue la carte la plus forte disponible
          const selectedCard = selectBestCard(validCards, currentTrick, trumpSuit);
          dispatch(playCard(selectedCard));
        }
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [currentPlayer, phase, players, dispatch, currentTrick, trumpSuit, contract.points]);
};

// Fonction utilitaire pour sélectionner la meilleure carte
const selectBestCard = (
  validCards: Card[],
  currentTrick: Card[],
  trumpSuit: CardSuit | null
): Card => {
  if (currentTrick.length === 0) {
    // Si c'est la première carte, joue une carte forte
    return validCards[validCards.length - 1];
  }

  const leadSuit = currentTrick[0].suit;
  const hasTrump = validCards.some(card => card.suit === trumpSuit);
  
  if (hasTrump && leadSuit !== trumpSuit) {
    // Si on peut couper, on le fait avec un petit atout
    return validCards.find(card => card.suit === trumpSuit)!;
  }

  // Sinon, joue la plus forte carte disponible
  return validCards[validCards.length - 1];
};