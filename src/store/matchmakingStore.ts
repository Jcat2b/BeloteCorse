import { create } from 'zustand';
import { doc, collection, setDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { MatchmakingState, QueuePlayer } from '../types/matchmaking';

interface MatchmakingStore extends MatchmakingState {
  joinQueue: (player: QueuePlayer) => Promise<void>;
  leaveQueue: () => Promise<void>;
  acceptMatch: () => Promise<void>;
  declineMatch: () => Promise<void>;
  reset: () => void;
}

export const useMatchmakingStore = create<MatchmakingStore>((set, get) => ({
  status: 'idle',
  
  joinQueue: async (player: QueuePlayer) => {
    try {
      const queueRef = doc(db, 'queue', player.id);
      await setDoc(queueRef, {
        ...player,
        joinedAt: Date.now(),
      });

      // Listen for match updates
      const unsubscribe = onSnapshot(doc(db, 'matches', player.id), (doc) => {
        if (doc.exists()) {
          const match = doc.data();
          set({
            status: 'matching',
            matchId: match.id,
          });
        }
      });

      set({
        status: 'queuing',
        player,
      });

      // Cleanup listener after 5 minutes to prevent indefinite waiting
      setTimeout(() => {
        unsubscribe();
        if (get().status === 'queuing') {
          get().leaveQueue();
          set({ status: 'idle', error: 'Queue timeout' });
        }
      }, 5 * 60 * 1000);

    } catch (error) {
      set({ status: 'idle', error: 'Failed to join queue' });
    }
  },

  leaveQueue: async () => {
    const { player } = get();
    if (player) {
      try {
        await deleteDoc(doc(db, 'queue', player.id));
        set({ status: 'idle', player: undefined });
      } catch (error) {
        set({ error: 'Failed to leave queue' });
      }
    }
  },

  acceptMatch: async () => {
    const { matchId, player } = get();
    if (matchId && player) {
      try {
        await updateDoc(doc(db, 'matches', matchId), {
          [`players.${player.id}.accepted`]: true,
        });
        set({ status: 'ready' });
      } catch (error) {
        set({ error: 'Failed to accept match' });
      }
    }
  },

  declineMatch: async () => {
    const { matchId, player } = get();
    if (matchId && player) {
      try {
        await deleteDoc(doc(db, 'matches', matchId));
        set({ status: 'idle', matchId: undefined });
      } catch (error) {
        set({ error: 'Failed to decline match' });
      }
    }
  },

  reset: () => {
    set({
      status: 'idle',
      player: undefined,
      matchId: undefined,
      estimatedWaitTime: undefined,
      queuePosition: undefined,
      error: undefined,
    });
  },
}));