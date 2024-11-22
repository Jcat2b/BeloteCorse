import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Friend, PlayerStats } from '../../types/social';

interface SocialState {
  friends: Friend[];
  playerStats: PlayerStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  friends: [],
  playerStats: null,
  loading: false,
  error: null,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
      state.loading = false;
    },
    updateFriendStatus: (state, action: PayloadAction<{ id: string; status: Friend['status'] }>) => {
      const friend = state.friends.find(f => f.id === action.payload.id);
      if (friend) {
        friend.status = action.payload.status;
        friend.lastSeen = Date.now();
      }
    },
    setPlayerStats: (state, action: PayloadAction<PlayerStats>) => {
      state.playerStats = action.payload;
    },
    updatePlayerStats: (state, action: PayloadAction<Partial<PlayerStats>>) => {
      if (state.playerStats) {
        state.playerStats = { ...state.playerStats, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setFriends,
  updateFriendStatus,
  setPlayerStats,
  updatePlayerStats,
  setLoading,
  setError,
} = socialSlice.actions;

export default socialSlice.reducer;