export interface Tournament {
  id: string;
  name: string;
  startDate: number;
  endDate: number | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  maxPlayers: number;
  currentPlayers: number;
  rounds: TournamentRound[];
  winner: string | null;
}

export interface TournamentRound {
  id: string;
  roundNumber: number;
  matches: TournamentMatch[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TournamentMatch {
  id: string;
  team1: {
    players: string[];
    score: number;
  };
  team2: {
    players: string[];
    score: number;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  winner: 1 | 2 | null;
  gameId: string | null;
}