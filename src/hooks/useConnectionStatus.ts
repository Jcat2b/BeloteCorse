import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playerDisconnected, playerReconnected } from '../store/features/gameSlice';
import type { RootState } from '../store';

export const useConnectionStatus = () => {
  const dispatch = useDispatch();
  const { players } = useSelector((state: RootState) => state.game);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleOnline = useCallback(() => {
    if (currentUser) {
      dispatch(playerReconnected(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  const handleOffline = useCallback(() => {
    if (currentUser) {
      dispatch(playerDisconnected(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (!currentUser) return;

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifie l'état initial
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, currentUser]);
};