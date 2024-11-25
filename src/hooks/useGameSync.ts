import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameState } from '../store/features/gameSlice';
import { gameService } from '../services/gameService';
import type { RootState } from '../store';

export const useGameSync = (gameId: string) => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game);

  useEffect(() => {
    if (!gameId) return;

    // S'abonner aux mises à jour de la partie
    const unsubscribe = gameService.subscribeToGame(gameId, (gameState) => {
      if (gameState.lastSaved > game.lastSaved) {
        dispatch(setGameState(gameState));
      }
    });

    return () => unsubscribe();
  }, [gameId, dispatch, game.lastSaved]);

  const saveGame = useCallback(async () => {
    if (game.id && game.lastSaved < Date.now() - 1000) {
      try {
        await gameService.updateGameState(game.id, {
          ...game,
          lastSaved: Date.now()
        });
      } catch (error) {
        console.error('Error saving game:', error);
      }
    }
  }, [game]);

  useEffect(() => {
    if (!game.id) return;

    const saveTimeout = setTimeout(saveGame, 1000);
    return () => clearTimeout(saveTimeout);
  }, [game, saveGame]);
};