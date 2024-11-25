import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { PlayerStats } from '../types/social';

const USERS_COLLECTION = 'users';

export const userService = {
  // Créer ou mettre à jour un profil utilisateur
  async updateUserProfile(userId: string, data: { 
    displayName: string;
    photoURL?: string;
  }): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  // Mettre à jour les statistiques du joueur
  async updatePlayerStats(userId: string, stats: {
    gamesWon?: boolean;
    contractSuccess?: boolean;
    contractPoints?: number;
  }): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, userId);
    
    const updates: any = {
      'stats.totalGames': increment(1),
      updatedAt: serverTimestamp(),
    };

    if (stats.gamesWon) {
      updates['stats.gamesWon'] = increment(1);
    }

    if (stats.contractSuccess !== undefined) {
      updates['stats.successfulContracts'] = increment(stats.contractSuccess ? 1 : 0);
      updates['stats.totalContracts'] = increment(1);
    }

    if (stats.contractPoints) {
      updates['stats.totalPoints'] = increment(stats.contractPoints);
      if (stats.contractPoints > 0) {
        await getDoc(userRef).then(doc => {
          const currentStats = doc.data()?.stats as PlayerStats;
          if (!currentStats?.highestContract || stats.contractPoints > currentStats.highestContract) {
            updates['stats.highestContract'] = stats.contractPoints;
          }
        });
      }
    }

    await updateDoc(userRef, updates);
  },

  // Récupérer les statistiques d'un joueur
  async getPlayerStats(userId: string): Promise<PlayerStats | null> {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data().stats as PlayerStats;
  }
};