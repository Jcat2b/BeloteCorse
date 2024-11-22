export type CardSuit = '♠' | '♥' | '♣' | '♦';
export type CardValue = '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type BidValue = 80 | 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160 | 'capot';

export interface Card {
  suit: CardSuit;
  value: CardValue;
}

export interface Bid {
  points: BidValue;
  suit: CardSuit;
  player: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  team: 1 | 2;
  position: 0 | 1 | 2 | 3;
}

export interface GameState {
  players: Player[];
  currentTrick: Card[];
  trumpSuit: CardSuit | null;
  currentPlayer: number;
  score: {
    team1: number;
    team2: number;
  };
  contract: {
    points: BidValue;
    suit: CardSuit | null;
    team: 1 | 2 | null;
    coinched: boolean;
    surcoinched: boolean;
  };
  phase: 'BIDDING' | 'PLAYING' | 'ENDED';
  tricks: {
    winner: 1 | 2;
    points: number;
  }[];
  bids: Bid[];
  consecutivePasses: number;
}