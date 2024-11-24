import { connect } from '@planetscale/database';
import { WebSocketPair } from '@cloudflare/workers-types';
import { Router } from 'itty-router';

interface Env {
  GAMES: KVNamespace;
}

// Configuration de la base de données
const config = {
  host: 'aws.connect.psdb.cloud',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

// Création du router
const router = Router();

// Gestion des connexions WebSocket
const websocketHandler = async (request: Request, env: Env) => {
  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);

  server.accept();

  // Gestion des messages
  server.addEventListener('message', async (event) => {
    try {
      const data = JSON.parse(event.data as string);
      
      switch (data.type) {
        case 'JOIN_GAME':
          await handleJoinGame(data.gameId, data.playerId, server, env);
          break;
        
        case 'GAME_ACTION':
          await handleGameAction(data.gameId, data.action, server, env);
          break;
        
        default:
          server.send(JSON.stringify({ error: 'Unknown message type' }));
      }
    } catch (error) {
      server.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
};

// Gestion des routes HTTP
router.post('/game/create', async (request: Request, env: Env) => {
  try {
    const { creatorId } = await request.json();
    const gameId = crypto.randomUUID();
    
    await env.GAMES.put(gameId, JSON.stringify({
      id: gameId,
      creatorId,
      players: [],
      status: 'WAITING',
      createdAt: Date.now(),
    }));

    return new Response(JSON.stringify({ gameId }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.post('/game/:id/join', async (request: Request, env: Env) => {
  try {
    const { id } = request.params;
    const { playerId } = await request.json();
    
    const game = await env.GAMES.get(id);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const gameData = JSON.parse(game);
    if (gameData.players.length >= 4) {
      return new Response(JSON.stringify({ error: 'Game is full' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    gameData.players.push(playerId);
    await env.GAMES.put(id, JSON.stringify(gameData));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to join game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Gestion des requêtes
async function handleRequest(request: Request, env: Env): Promise<Response> {
  // Gestion des WebSocket
  if (request.headers.get('Upgrade') === 'websocket') {
    return websocketHandler(request, env);
  }

  // Gestion des routes HTTP
  return router.handle(request, env);
}

// Configuration du worker
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Gestion CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Ajout des headers CORS pour toutes les réponses
    const response = await handleRequest(request, env);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  },
};

// Fonctions utilitaires
async function handleJoinGame(gameId: string, playerId: string, ws: WebSocket, env: Env) {
  const game = await env.GAMES.get(gameId);
  if (!game) {
    ws.send(JSON.stringify({ error: 'Game not found' }));
    return;
  }

  const gameData = JSON.parse(game);
  ws.send(JSON.stringify({ type: 'GAME_STATE', data: gameData }));
}

async function handleGameAction(gameId: string, action: any, ws: WebSocket, env: Env) {
  const game = await env.GAMES.get(gameId);
  if (!game) {
    ws.send(JSON.stringify({ error: 'Game not found' }));
    return;
  }

  const gameData = JSON.parse(game);
  // Appliquer l'action au jeu
  // TODO: Implémenter la logique du jeu

  await env.GAMES.put(gameId, JSON.stringify(gameData));
  ws.send(JSON.stringify({ type: 'GAME_STATE', data: gameData }));
}