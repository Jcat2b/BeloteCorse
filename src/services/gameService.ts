import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { GameState } from '../types/game';

const GAMES_COLLECTION = 'games';

export const gameService = {
  // Créer une nouvelle partie
  async createGame(creatorId: string): Promise<string> {
    const gameRef = doc(collection(db, GAMES_COLLECTION));
    const gameState: GameState = {
      id: gameRef.id,
      players: [],
      currentTrick: [],
      trumpSuit: null,
      currentPlayer: 0,
      score: { team1: 0, team2: 0 },
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
      turnStartTime: Date.now(),
      lastSaved: Date.now(),
      status: 'ACTIVE',
      pauseReason: null,
      abandonedBy: [],
      lastAnnouncement: null
    };

    await setDoc(gameRef, {
      ...gameState,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return gameRef.id;
  },

  // Rejoindre une partie
  async joinGame(gameId: string, playerId: string): Promise<void> {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error('Game not found');
    }

    const gameData = gameDoc.data() as GameState;
    if (gameData.players.length >= 4) {
      throw new Error('Game is full');
    }

    await updateDoc(gameRef, {
      players: [...gameData.players, playerId],
      updatedAt: serverTimestamp(),
    });
  },

  // Mettre à jour l'état du jeu
  async updateGameState(gameId: string, gameState: Partial<GameState>): Promise<void> {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    await updateDoc(gameRef, {
      ...gameState,
      updatedAt: serverTimestamp(),
    });
  },

  // S'abonner aux changements d'une partie
  subscribeToGame(gameId: string, callback: (gameState: GameState) => void): () => void {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    return onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as GameState);
      }
    });
  }
};