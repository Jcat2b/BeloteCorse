import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../config/worker';
import { setGameState } from '../store/features/gameSlice';
import type { GameState } from '../types/game';

export const useWorkerSync = (gameId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameId) return;

    // S'abonner aux mises à jour de la partie
    socket.emit('join_game', gameId);

    // Écouter les mises à jour de l'état du jeu
    const handleGameUpdate = (newState: GameState) => {
      dispatch(setGameState(newState));
    };

    socket.on('game_update', handleGameUpdate);

    // Nettoyage lors du démontage
    return () => {
      socket.off('game_update', handleGameUpdate);
      socket.emit('leave_game', gameId);
    };
  }, [gameId, dispatch]);
};