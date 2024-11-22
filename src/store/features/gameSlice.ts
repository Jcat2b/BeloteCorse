import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState, Card, Bid } from '../../types/game';
import { 
  calculateTrickWinner, 
  calculateTrickPoints, 
  isValidPlay 
} from '../../utils/gameRules';

interface InitializeGamePayload {
  currentPlayerId: string;
  gameId: string;
  playerName: string;
}

const initialState: GameState = {
  players: [],
  currentTrick: [],
  trumpSuit: null,
  currentPlayer: 0,
  score: {
    team1: 0,
    team2: 0,
  },
  contract: {
    points: 0,
    suit: null,
    team: null,
    coinched: false,
    surcoinched: false,
  },
  phase: 'BIDDING',
  tricks: [],
  bids: [],
  consecutivePasses: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state, action: PayloadAction<InitializeGamePayload>) => {
      const { currentPlayerId, playerName } = action.payload;
      
      // Initialiser avec le joueur actuel et des bots pour le test
      state.players = [
        { id: currentPlayerId, name: playerName, hand: [], team: 1, position: 0 },
        { id: 'bot1', name: 'Bot 1', hand: [], team: 2, position: 1 },
        { id: 'bot2', name: 'Bot 2', hand: [], team: 1, position: 2 },
        { id: 'bot3', name: 'Bot 3', hand: [], team: 2, position: 3 },
      ];

      // Distribuer des cartes (simulation)
      const deck = generateDeck();
      state.players.forEach((player, index) => {
        player.hand = deck.slice(index * 8, (index + 1) * 8);
      });
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
    placeBid: (state, action: PayloadAction<Bid>) => {
      const { points, suit, player } = action.payload;
      state.bids.push(action.payload);
      state.consecutivePasses = 0;
      state.contract = {
        points,
        suit,
        team: state.players[player].team,
        coinched: false,
        surcoinched: false,
      };
      state.currentPlayer = (state.currentPlayer + 1) % 4;
    },
    pass: (state) => {
      state.consecutivePasses += 1;
      state.currentPlayer = (state.currentPlayer + 1) % 4;
      
      if (state.consecutivePasses === 3 && state.contract.suit) {
        state.phase = 'PLAYING';
        state.trumpSuit = state.contract.suit;
      } else if (state.consecutivePasses === 4 && !state.contract.suit) {
        // Redistribution à implémenter
        state.phase = 'BIDDING';
        state.consecutivePasses = 0;
        state.bids = [];
      }
    },
    coinche: (state) => {
      if (state.contract.suit) {
        state.contract.coinched = true;
        state.phase = 'PLAYING';
        state.trumpSuit = state.contract.suit;
      }
    },
    surcoinche: (state) => {
      if (state.contract.coinched) {
        state.contract.surcoinched = true;
        state.phase = 'PLAYING';
        state.trumpSuit = state.contract.suit;
      }
    },
    playCard: (state, action: PayloadAction<Card>) => {
      const playerIndex = state.currentPlayer;
      const player = state.players[playerIndex];
      
      if (!isValidPlay(
        action.payload,
        player.hand,
        state.currentTrick,
        state.trumpSuit
      )) {
        return;
      }

      player.hand = player.hand.filter(
        card => card.suit !== action.payload.suit || card.value !== action.payload.value
      );
      state.currentTrick.push(action.payload);
      
      state.currentPlayer = (state.currentPlayer + 1) % 4;

      if (state.currentTrick.length === 4) {
        const winnerIndex = calculateTrickWinner(state.currentTrick, state.trumpSuit);
        const points = calculateTrickPoints(state.currentTrick, state.trumpSuit);
        
        state.tricks.push({
          winner: state.players[winnerIndex].team,
          points,
        });
        
        state.currentTrick = [];
        state.currentPlayer = winnerIndex;

        if (state.tricks.length === 8) {
          const totalPoints = state.tricks.reduce((sum, trick) => {
            return trick.winner === state.contract.team ? sum + trick.points : sum;
          }, 0);

          const finalScore = calculateFinalScore(
            totalPoints,
            typeof state.contract.points === 'number' ? state.contract.points : 250,
            state.contract.coinched,
            state.contract.surcoinched
          );

          if (state.contract.team === 1) {
            state.score.team1 += finalScore;
          } else {
            state.score.team2 += finalScore;
          }

          state.phase = 'ENDED';
        }
      }
    },
  },
});

// Fonction utilitaire pour générer un jeu de cartes
const generateDeck = (): Card[] => {
  const suits: CardSuit[] = ['♠', '♥', '♣', '♦'];
  const values: CardValue[] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({ suit, value });
    });
  });

  // Mélanger le deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const { 
  initializeGame,
  setGameState, 
  placeBid, 
  pass, 
  coinche, 
  surcoinche, 
  playCard 
} = gameSlice.actions;

export default gameSlice.reducer;