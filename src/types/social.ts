export interface Friend {
  id: string;
  displayName: string;
  photoURL: string | null;
  status: 'online' | 'offline' | 'in-game';
  lastSeen: number;
}

export interface PlayerStats {
  totalGames: number;
  gamesWon: number;
  totalPoints: number;
  highestContract: number;
  successfulContracts: number;
  totalContracts: number;
  coinches: number;
  surcoinches: number;
}