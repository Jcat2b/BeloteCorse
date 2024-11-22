import type { Card, CardSuit, CardValue } from '../types/game';

// Valeurs des cartes (pour le calcul des points)
const CARD_VALUES: Record<CardValue, number> = {
  '7': 0,
  '8': 0,
  '9': 14, // Vaut 14 à l'atout
  '10': 10,
  'J': 20, // Vaut 20 à l'atout
  'Q': 3,
  'K': 4,
  'A': 11,
};

// Valeurs des cartes hors atout
const NON_TRUMP_VALUES: Record<CardValue, number> = {
  ...CARD_VALUES,
  '9': 0,
  'J': 2,
};

// Ordre des cartes à l'atout
const TRUMP_ORDER: CardValue[] = ['7', '8', 'Q', 'K', '10', 'A', '9', 'J'];

// Ordre des cartes hors atout
const NON_TRUMP_ORDER: CardValue[] = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];

export const isValidPlay = (
  card: Card,
  hand: Card[],
  trick: Card[],
  trumpSuit: CardSuit | null
): boolean => {
  if (trick.length === 0) return true;

  const leadSuit = trick[0].suit;
  const hasSuit = hand.some(c => c.suit === leadSuit);
  
  // Si le joueur a la couleur demandée, il doit la jouer
  if (hasSuit) {
    return card.suit === leadSuit;
  }

  // Si le joueur n'a pas la couleur demandée et que c'est de l'atout
  if (trumpSuit && leadSuit === trumpSuit) {
    return true;
  }

  // Si le joueur n'a pas la couleur demandée, il peut couper ou défausser
  return true;
};

export const calculateTrickWinner = (
  trick: Card[],
  trumpSuit: CardSuit | null
): number => {
  if (trick.length !== 4) return 0;

  const leadSuit = trick[0].suit;
  let winningCardIndex = 0;
  let highestRank = getCardRank(trick[0], trumpSuit, leadSuit);

  for (let i = 1; i < trick.length; i++) {
    const currentRank = getCardRank(trick[i], trumpSuit, leadSuit);
    if (
      (trick[i].suit === trumpSuit && trick[winningCardIndex].suit !== trumpSuit) ||
      (trick[i].suit === trumpSuit && trick[winningCardIndex].suit === trumpSuit && currentRank > highestRank) ||
      (trick[i].suit === leadSuit && trick[winningCardIndex].suit === leadSuit && currentRank > highestRank)
    ) {
      winningCardIndex = i;
      highestRank = currentRank;
    }
  }

  return winningCardIndex;
};

export const calculateTrickPoints = (
  trick: Card[],
  trumpSuit: CardSuit | null
): number => {
  return trick.reduce((total, card) => {
    if (card.suit === trumpSuit) {
      return total + CARD_VALUES[card.value];
    }
    return total + NON_TRUMP_VALUES[card.value];
  }, 0);
};

export const calculateFinalScore = (
  trickPoints: number,
  contractPoints: number,
  isCoinched: boolean,
  isSurcoinched: boolean
): number => {
  const multiplier = isSurcoinched ? 4 : isCoinched ? 2 : 1;
  
  if (trickPoints >= contractPoints) {
    return trickPoints * multiplier;
  } else {
    return -contractPoints * multiplier;
  }
};

// Fonction utilitaire pour obtenir le rang d'une carte
const getCardRank = (
  card: Card,
  trumpSuit: CardSuit | null,
  leadSuit: CardSuit
): number => {
  const order = card.suit === trumpSuit ? TRUMP_ORDER : NON_TRUMP_ORDER;
  return order.indexOf(card.value);
};