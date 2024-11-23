import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTurnTimer } from '../store/features/gameSlice';
import type { RootState } from '../store';

export const TURN_TIMER_DURATION = 30; // seconds

export const useGameTimer = () => {
  const dispatch = useDispatch();
  const { phase } = useSelector((state: RootState) => state.game);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (phase === 'WAITING' || phase === 'ENDED') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      dispatch(updateTurnTimer());
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [dispatch, phase]);
};