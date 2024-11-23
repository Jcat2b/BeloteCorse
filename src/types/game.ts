export type CardSuit = '♠' | '♥' | '♣' | '♦';
export type CardValue = '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type BidValue = 80 | 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160 | 'capot';
export type GamePhase = 'WAITING' | 'PAUSED' | 'BIDDING' | 'PLAYING' | 'ENDED';
export type GameStatus = 'ACTIVE' | 'PAUSED' | 'ABANDONED';

export interface Card {
  suit: CardSuit;
  value: CardValue;
}

export interface Announcement {
  type: 'BELOTE' | 'REBELOTE';
  playerId: string;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  team: 1 | 2;
  position: 0 | 1 | 2 | 3;
  connected: boolean;
  lastAction: number;
  isBot: boolean;
  hasAbandoned: boolean;
  announcements: Announcement[];
}

export interface Bid {
  id: string;
  points: number;
  suit: CardSuit;
  player: number;
}

export interface GameState {
  id: string;
  players: Player[];
  currentTrick: Card[];
  trumpSuit: CardSuit | null;
  currentPlayer: number;
  score: {
    team1: number;
    team2: number;
  };
  contract: {
    points: number;
    suit: CardSuit | null;
    team: 1 | 2 | null;
    coinched: boolean;
    surcoinched: boolean;
  };
  phase: GamePhase;
  tricks: {
    winner: 1 | 2;
    points: number;
    cards: Card[];
  }[];
  bids: Bid[];
  consecutivePasses: number;
  turnStartTime: number;
  lastSaved: number;
  status: GameStatus;
  pauseReason: string | null;
  abandonedBy: string[];
  lastAnnouncement: Announcement | null;
}