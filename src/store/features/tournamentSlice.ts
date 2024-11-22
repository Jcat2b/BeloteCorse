import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tournament, TournamentMatch } from '../../types/tournament';

interface TournamentState {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  loading: boolean;
  error: string | null;
}

const initialState: TournamentState = {
  tournaments: [],
  currentTournament: null,
  loading: false,
  error: null,
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setTournaments: (state, action: PayloadAction<Tournament[]>) => {
      state.tournaments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentTournament: (state, action: PayloadAction<Tournament>) => {
      state.currentTournament = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateMatch: (state, action: PayloadAction<{ 
      tournamentId: string;
      roundId: string;
      matchId: string;
      match: TournamentMatch;
    }>) => {
      const { tournamentId, roundId, matchId, match } = action.payload;
      const tournament = state.tournaments.find(t => t.id === tournamentId);
      if (tournament) {
        const round = tournament.rounds.find(r => r.id === roundId);
        if (round) {
          const matchIndex = round.matches.findIndex(m => m.id === matchId);
          if (matchIndex !== -1) {
            round.matches[matchIndex] = match;
          }
        }
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
  setTournaments,
  setCurrentTournament,
  updateMatch,
  setLoading,
  setError,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;