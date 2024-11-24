import React from 'react';
import { useSelector } from 'react-redux';
import { useMatchmakingStore } from '../../store/matchmakingStore';
import type { RootState } from '../../store';
import { Play } from 'lucide-react';

const QuickPlay: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { status } = useMatchmakingStore();

  const handleQuickPlay = () => {
    if (!user) return;

    useMatchmakingStore.getState().joinQueue({
      id: user.uid,
      displayName: user.displayName || 'Anonyme',
      rating: 1000,
      joinedAt: Date.now(),
      preferences: {
        ratingRange: 200,
        maxWaitTime: 300,
      },
    });
  };

  if (status !== 'idle') return null;

  return (
    <button
      onClick={handleQuickPlay}
      className="w-full btn btn-primary flex items-center justify-center gap-2"
    >
      <Play className="h-5 w-5" />
      Partie rapide
    </button>
  );
};