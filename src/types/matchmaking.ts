export interface QueuePlayer {
  id: string;
  displayName: string;
  rating: number;
  joinedAt: number;
  preferences?: {
    ratingRange?: number;
    maxWaitTime?: number;
  };
}

export interface MatchmakingState {
  status: 'idle' | 'queuing' | 'matching' | 'ready';
  player?: QueuePlayer;
  matchId?: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
  error?: string;
}

export interface Match {
  id: string;
  status: 'pending' | 'starting' | 'active';
  players: QueuePlayer[];
  createdAt: number;
  gameId?: string;
}