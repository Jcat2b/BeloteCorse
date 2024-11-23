import type { Card, CardSuit, CardValue, GameState, Player } from '../types/game';

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

// Vérifie si un joueur peut annoncer une belote
export const canAnnounceBelote = (player: Player, trumpSuit: CardSuit): boolean => {
  const hasQueen = player.hand.some(card => card.suit === trumpSuit && card.value === 'Q');
  const hasKing = player.hand.some(card => card.suit === trumpSuit && card.value === 'K');
  
  // Vérifie si le joueur n'a pas déjà annoncé une belote
  const hasAlreadyAnnounced = player.announcements.some(
    announcement => announcement.type === 'BELOTE'
  );

  return hasQueen && hasKing && !hasAlreadyAnnounced;
};

// Vérifie si un joueur peut annoncer une rebelote
export const canAnnounceRebelote = (player: Player, trumpSuit: CardSuit): boolean => {
  // Le joueur doit avoir déjà annoncé une belote pour pouvoir annoncer une rebelote
  const hasBelote = player.announcements.some(
    announcement => announcement.type === 'BELOTE'
  );
  
  const hasQueen = player.hand.some(card => card.suit === trumpSuit && card.value === 'Q');
  const hasKing = player.hand.some(card => card.suit === trumpSuit && card.value === 'K');
  
  // Vérifie si le joueur n'a pas déjà annoncé une rebelote
  const hasAlreadyAnnounced = player.announcements.some(
    announcement => announcement.type === 'REBELOTE'
  );

  return hasBelote && (hasQueen || hasKing) && !hasAlreadyAnnounced;
};

// Génère un jeu de cartes mélangé
export const generateDeck = (): Card[] => {
  const suits: CardSuit[] = ['♠', '♥', '♣', '♦'];
  const values: CardValue[] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({ suit, value });
    });
  });

  // Mélanger le deck (Fisher-Yates shuffle)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

// Distribue les cartes aux joueurs
export const dealCards = (state: GameState) => {
  const deck = generateDeck();
  
  // Distribution spécifique à la Belote Corse : 8 cartes par joueur
  state.players.forEach((player, index) => {
    player.hand = deck.slice(index * 8, (index + 1) * 8);
    player.announcements = []; // Réinitialise les annonces
  });
};

// Vérifie si une enchère est valide
export const isValidBid = (points: number, currentContract: number): boolean => {
  // Les enchères doivent être des multiples de 10
  if (points % 10 !== 0) return false;
  
  // L'enchère minimale est de 80
  if (points < 80) return false;
  
  // L'enchère maximale est de 160 (hors capot)
  if (points > 160 && points !== 250) return false; // 250 représente le capot
  
  // L'enchère doit être supérieure à l'enchère précédente
  return points > currentContract;
};

// Vérifie si une carte peut être jouée
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

// Détermine le gagnant d'un pli
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

// Calcule les points d'un pli
export const calculateTrickPoints = (
  trick: Card[],
  trumpSuit: CardSuit | null,
  announcements: number = 0
): number => {
  const basePoints = trick.reduce((total, card) => {
    if (card.suit === trumpSuit) {
      return total + CARD_VALUES[card.value];
    }
    return total + NON_TRUMP_VALUES[card.value];
  }, 0);

  // Ajoute les points des annonces (20 points pour belote/rebelote)
  return basePoints + announcements * 20;
};

// Calcule le score final
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