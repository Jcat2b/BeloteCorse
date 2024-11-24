import { describe, test, expect } from 'vitest';
import {
  calculateTrickPoints,
  calculateTrickWinner,
  isValidPlay,
  isValidBid,
  canAnnounceBelote,
  canAnnounceRebelote,
  generateDeck,
  dealCards,
} from '../gameRules';
import type { Card, CardSuit, GameState } from '../../types/game';

describe('Game Rules', () => {
  describe('calculateTrickPoints', () => {
    test('calculates points correctly for non-trump cards', () => {
      const trick: Card[] = [
        { suit: '♠', value: 'A' },
        { suit: '♥', value: 'K' },
        { suit: '♣', value: 'Q' },
        { suit: '♦', value: 'J' },
      ];
      const trumpSuit: CardSuit = '♣';
      expect(calculateTrickPoints(trick, trumpSuit)).toBe(20); // 11 + 4 + 3 + 2
    });

    test('calculates points correctly with trump cards', () => {
      const trick: Card[] = [
        { suit: '♣', value: 'J' }, // Trump J = 20
        { suit: '♣', value: '9' }, // Trump 9 = 14
        { suit: '♥', value: 'A' }, // Non-trump A = 11
        { suit: '♦', value: 'K' }, // Non-trump K = 4
      ];
      const trumpSuit: CardSuit = '♣';
      expect(calculateTrickPoints(trick, trumpSuit)).toBe(49);
    });
  });

  describe('calculateTrickWinner', () => {
    test('highest card of led suit wins when no trumps played', () => {
      const trick: Card[] = [
        { suit: '♠', value: '10' },
        { suit: '♠', value: 'K' },
        { suit: '♠', value: 'A' },
        { suit: '♠', value: 'Q' },
      ];
      expect(calculateTrickWinner(trick, '♣')).toBe(2); // Ace wins
    });

    test('trump card wins over higher cards of led suit', () => {
      const trick: Card[] = [
        { suit: '♠', value: 'A' },
        { suit: '♣', value: '7' }, // Trump
        { suit: '♠', value: 'K' },
        { suit: '♠', value: 'Q' },
      ];
      expect(calculateTrickWinner(trick, '♣')).toBe(1);
    });
  });

  describe('isValidPlay', () => {
    test('can play any card if first to play', () => {
      const hand: Card[] = [
        { suit: '♠', value: '7' },
        { suit: '♥', value: 'A' },
      ];
      const trick: Card[] = [];
      expect(isValidPlay({ suit: '♠', value: '7' }, hand, trick, '♣')).toBe(true);
      expect(isValidPlay({ suit: '♥', value: 'A' }, hand, trick, '♣')).toBe(true);
    });

    test('must follow suit if possible', () => {
      const hand: Card[] = [
        { suit: '♠', value: '7' },
        { suit: '♠', value: '8' },
        { suit: '♥', value: 'A' },
      ];
      const trick: Card[] = [{ suit: '♠', value: 'K' }];
      expect(isValidPlay({ suit: '♠', value: '7' }, hand, trick, '♣')).toBe(true);
      expect(isValidPlay({ suit: '♥', value: 'A' }, hand, trick, '♣')).toBe(false);
    });
  });

  describe('isValidBid', () => {
    test('bid must be higher than current contract', () => {
      expect(isValidBid(90, 80)).toBe(true);
      expect(isValidBid(80, 90)).toBe(false);
    });

    test('bid must be multiple of 10', () => {
      expect(isValidBid(85, 80)).toBe(false);
      expect(isValidBid(90, 80)).toBe(true);
    });

    test('bid must be between 80 and 160', () => {
      expect(isValidBid(70, 0)).toBe(false);
      expect(isValidBid(170, 160)).toBe(false);
      expect(isValidBid(160, 150)).toBe(true);
    });
  });

  describe('generateDeck', () => {
    test('generates a complete deck of 32 cards', () => {
      const deck = generateDeck();
      expect(deck.length).toBe(32);
      
      // Check for duplicates
      const cardStrings = deck.map(card => `${card.suit}${card.value}`);
      const uniqueCards = new Set(cardStrings);
      expect(uniqueCards.size).toBe(32);
    });

    test('contains all required suits and values', () => {
      const deck = generateDeck();
      const suits = new Set(deck.map(card => card.suit));
      const values = new Set(deck.map(card => card.value));

      expect(suits.size).toBe(4);
      expect(values.size).toBe(8);
    });
  });

  describe('dealCards', () => {
    test('deals 8 cards to each player', () => {
      const gameState: GameState = {
        id: 'test',
        players: Array(4).fill(null).map((_, i) => ({
          id: `player${i}`,
          name: `Player ${i}`,
          hand: [],
          team: i % 2 === 0 ? 1 : 2,
          position: i,
          connected: true,
          lastAction: Date.now(),
          isBot: false,
          hasAbandoned: false,
          announcements: []
        })),
        currentTrick: [],
        trumpSuit: null,
        currentPlayer: 0,
        score: { team1: 0, team2: 0 },
        contract: {
          points: 0,
          suit: null,
          team: null,
          coinched: false,
          surcoinched: false
        },
        phase: 'WAITING',
        tricks: [],
        bids: [],
        consecutivePasses: 0,
        turnStartTime: Date.now(),
        lastSaved: Date.now(),
        status: 'ACTIVE',
        pauseReason: null,
        abandonedBy: [],
        lastAnnouncement: null
      };

      dealCards(gameState);

      gameState.players.forEach(player => {
        expect(player.hand.length).toBe(8);
      });
    });
  });
});