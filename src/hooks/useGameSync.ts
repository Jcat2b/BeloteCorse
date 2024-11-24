import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { setGameState, saveGameState } from '../store/features/gameSlice';
import type { RootState } from '../store';

export const useGameSync = (gameId: string) => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (!gameId) return;

    const gameRef = doc(db, 'games', gameId);
    
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.lastSaved > game.lastSaved) {
          dispatch(setGameState(data));
        }
      }
    });

    return () => unsubscribe();
  }, [gameId, dispatch, game.lastSaved]);

  const saveGame = useCallback(() => {
    if (game.id && game.lastSaved < Date.now() - 1000) {
      dispatch(saveGameState());
    }
  }, [game.id, game.lastSaved, dispatch]);

  useEffect(() => {
    if (!game.id) return;

    const saveTimeout = setTimeout(saveGame, 1000);
    return () => clearTimeout(saveTimeout);
  }, [
    game.id,
    game.phase,
    game.currentPlayer,
    game.currentTrick,
    game.score,
    saveGame
  ]);
};