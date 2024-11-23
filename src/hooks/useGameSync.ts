import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { setGameState, saveGameState } from '../store/features/gameSlice';
import type { RootState } from '../store';

export const useGameSync = (gameId: string) => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game);

  // Écoute des changements dans Firestore
  useEffect(() => {
    if (!gameId) return;

    const gameRef = doc(db, 'games', gameId);
    
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Ne met à jour que si les données sont plus récentes
        if (data.lastSaved > game.lastSaved) {
          dispatch(setGameState(data));
        }
      }
    });

    return () => unsubscribe();
  }, [gameId, dispatch]);

  // Sauvegarde des changements locaux
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (game.id && game.lastSaved < Date.now() - 1000) { // Évite les sauvegardes trop fréquentes
        dispatch(saveGameState());
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [game.id, game.phase, game.currentPlayer, game.currentTrick, game.score, dispatch]);
};