import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GameState, Card, Bid, GameStatus, Announcement } from '../../types/game';
import { 
  calculateTrickWinner, 
  calculateTrickPoints,
  isValidPlay,
  dealCards,
  isValidBid,
  canAnnounceBelote,
  canAnnounceRebelote
} from '../../utils/gameRules';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const initialState: GameState = {
  id: '',
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
  phase: 'WAITING',
  tricks: [],
  bids: [],
  consecutivePasses: 0,
  turnStartTime: 0,
  lastSaved: 0,
  status: 'ACTIVE',
  pauseReason: null,
  abandonedBy: [],
  lastAnnouncement: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state, action: PayloadAction<{ currentPlayerId: string; gameId: string; playerName: string }>) => {
      state.id = action.payload.gameId;
      state.players = [{
        id: action.payload.currentPlayerId,
        name: action.payload.playerName,
        hand: [],
        team: 1,
        position: 0,
        connected: true,
        lastAction: Date.now(),
        isBot: false,
        hasAbandoned: false,
        announcements: []
      }];
      state.phase = 'WAITING';
      state.turnStartTime = Date.now();
    },

    addPlayer: (state, action: PayloadAction<{ id: string; name: string; isBot: boolean }>) => {
      if (state.players.length >= 4) return;
      
      state.players.push({
        id: action.payload.id,
        name: action.payload.name,
        hand: [],
        team: state.players.length % 2 === 0 ? 1 : 2,
        position: state.players.length,
        connected: true,
        lastAction: Date.now(),
        isBot: action.payload.isBot,
        hasAbandoned: false,
        announcements: []
      });

      if (state.players.length === 4) {
        state.phase = 'BIDDING';
        dealCards(state);
      }
    },

    placeBid: (state, action: PayloadAction<Bid>) => {
      if (!isValidBid(action.payload.points, state.contract.points)) return;
      
      state.bids.push(action.payload);
      state.consecutivePasses = 0;
      state.contract = {
        points: action.payload.points,
        suit: action.payload.suit,
        team: state.players[action.payload.player].team,
        coinched: false,
        surcoinched: false,
      };
      state.currentPlayer = (state.currentPlayer + 1) % 4;
      state.turnStartTime = Date.now();
    },

    pass: (state) => {
      state.consecutivePasses++;
      state.currentPlayer = (state.currentPlayer + 1) % 4;
      state.turnStartTime = Date.now();

      if (state.consecutivePasses === 3 && state.contract.suit) {
        state.phase = 'PLAYING';
        state.trumpSuit = state.contract.suit;
      }
    },

    coinche: (state) => {
      if (!state.contract.suit || state.contract.coinched) return;
      state.contract.coinched = true;
      state.phase = 'PLAYING';
      state.trumpSuit = state.contract.suit;
    },

    surcoinche: (state) => {
      if (!state.contract.coinched || state.contract.surcoinched) return;
      state.contract.surcoinched = true;
    },

    announceBelote: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (!player || !state.trumpSuit || !canAnnounceBelote(player, state.trumpSuit)) {
        return;
      }

      const announcement: Announcement = {
        type: 'BELOTE',
        playerId: action.payload,
        timestamp: Date.now()
      };

      player.announcements.push(announcement);
      state.lastAnnouncement = announcement;
    },

    announceRebelote: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (!player || !state.trumpSuit || !canAnnounceRebelote(player, state.trumpSuit)) {
        return;
      }

      const announcement: Announcement = {
        type: 'REBELOTE',
        playerId: action.payload,
        timestamp: Date.now()
      };

      player.announcements.push(announcement);
      state.lastAnnouncement = announcement;
    },

    playCard: (state, action: PayloadAction<Card>) => {
      const playerIndex = state.currentPlayer;
      const player = state.players[playerIndex];
      
      if (!isValidPlay(action.payload, player.hand, state.currentTrick, state.trumpSuit)) {
        return;
      }

      if (state.trumpSuit && 
          action.payload.suit === state.trumpSuit && 
          (action.payload.value === 'Q' || action.payload.value === 'K')) {
        if (canAnnounceBelote(player, state.trumpSuit)) {
          player.announcements.push({
            type: 'BELOTE',
            playerId: player.id,
            timestamp: Date.now()
          });
        } else if (canAnnounceRebelote(player, state.trumpSuit)) {
          player.announcements.push({
            type: 'REBELOTE',
            playerId: player.id,
            timestamp: Date.now()
          });
        }
      }

      player.hand = player.hand.filter(
        card => !(card.suit === action.payload.suit && card.value === action.payload.value)
      );
      
      state.currentTrick.push(action.payload);
      state.currentPlayer = (state.currentPlayer + 1) % 4;
      state.turnStartTime = Date.now();

      if (state.currentTrick.length === 4) {
        const winnerIndex = calculateTrickWinner(state.currentTrick, state.trumpSuit);
        const announcements = state.players.reduce((count, p) => 
          count + p.announcements.filter(a => 
            a.timestamp > state.tricks[state.tricks.length - 1]?.timestamp || 0
          ).length, 0);
        
        const points = calculateTrickPoints(state.currentTrick, state.trumpSuit, announcements);
        
        state.tricks.push({
          winner: state.players[winnerIndex].team,
          points,
          cards: [...state.currentTrick]
        });
        
        state.currentTrick = [];
        state.currentPlayer = winnerIndex;

        if (state.tricks.length === 8) {
          const totalPoints = state.tricks.reduce((sum, trick) => {
            return trick.winner === state.contract.team ? sum + trick.points : sum;
          }, 0);

          const finalScore = calculateTrickPoints(state.currentTrick, state.trumpSuit);
          
          if (state.contract.team === 1) {
            state.score.team1 += finalScore;
          } else {
            state.score.team2 += finalScore;
          }

          state.phase = 'ENDED';
        }
      }
    },

    updateTurnTimer: (state) => {
      const currentTime = Date.now();
      if (currentTime - state.turnStartTime > 30000) { // 30 secondes
        state.currentPlayer = (state.currentPlayer + 1) % 4;
        state.turnStartTime = currentTime;
      }
    },

    playerDisconnected: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.connected = false;
        if (state.phase !== 'ENDED') {
          state.status = 'PAUSED';
          state.pauseReason = 'Joueur déconnecté';
        }
      }
    },

    playerReconnected: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.connected = true;
        if (state.players.every(p => p.connected)) {
          state.status = 'ACTIVE';
          state.pauseReason = null;
        }
      }
    },

    abandonGame: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.hasAbandoned = true;
        state.abandonedBy.push(action.payload);
        if (state.phase !== 'ENDED') {
          state.phase = 'ENDED';
          state.status = 'ABANDONED';
        }
      }
    },

    setGameState: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },

    saveGameState: (state) => {
      state.lastSaved = Date.now();
      setDoc(doc(db, 'games', state.id), state);
    }
  }
});

export const { 
  initializeGame,
  addPlayer,
  placeBid,
  pass,
  coinche,
  surcoinche,
  playCard,
  updateTurnTimer,
  playerDisconnected,
  playerReconnected,
  abandonGame,
  setGameState,
  saveGameState,
  announceBelote,
  announceRebelote
} = gameSlice.actions;

export default gameSlice.reducer;