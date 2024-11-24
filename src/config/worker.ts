import { io } from 'socket.io-client';

const WORKER_URL = 'https://damp-forest-0b2b.jerem-catta.workers.dev';

// Configuration du socket
export const socket = io(WORKER_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Gestionnaire d'événements de connexion
socket.on('connect', () => {
  console.log('Connected to game server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// API pour communiquer avec le worker
export const workerAPI = {
  // Rejoindre une partie
  joinGame: async (gameId: string, playerId: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/game/${gameId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  },

  // Créer une nouvelle partie
  createGame: async (creatorId: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creatorId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  // Envoyer une action de jeu
  sendGameAction: async (gameId: string, action: any) => {
    try {
      const response = await fetch(`${WORKER_URL}/game/${gameId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending game action:', error);
      throw error;
    }
  },
};