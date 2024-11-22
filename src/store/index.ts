import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import gameReducer from './features/gameSlice';
import socialReducer from './features/socialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    social: socialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;