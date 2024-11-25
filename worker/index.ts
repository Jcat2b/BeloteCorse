import { connect } from '@libsql/client';
import { Router } from 'itty-router';
import { initDatabase, saveGame, getGame } from './database';

interface Env {
  DB: D1Database;
  GAMES_CACHE: KVNamespace;
}

const router = Router();

// Middleware pour la gestion des erreurs
const errorHandler = async (error: Error) => {
  console.error('Error:', error);
  return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Route pour créer une nouvelle partie
router.post('/game/create', async (request: Request, env: Env) => {
  try {
    const { creatorId } = await request.json();
    const gameId = crypto.randomUUID();
    
    // Créer la partie dans la base de données
    await saveGame(gameId, {
      id: gameId,
      creatorId,
      players: [],
      status: 'WAITING',
      createdAt: Date.now(),
    });

    // Mettre en cache pour un accès rapide
    await env.GAMES_CACHE.put(gameId, JSON.stringify({
      id: gameId,
      creatorId,
      status: 'WAITING'
    }), { expirationTtl: 3600 }); // Cache d'une heure

    return new Response(JSON.stringify({ gameId }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorHandler(error);
  }
});

// Route pour rejoindre une partie
router.post('/game/:id/join', async (request: Request, env: Env) => {
  try {
    const { id } = request.params;
    const { playerId } = await request.json();
    
    // Vérifier si la partie existe
    const game = await getGame(id);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mettre à jour la partie
    game.players.push(playerId);
    await saveGame(id, game);
    
    // Mettre à jour le cache
    await env.GAMES_CACHE.put(id, JSON.stringify(game), { expirationTtl: 3600 });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorHandler(error);
  }
});

// Route pour récupérer l'état d'une partie
router.get('/game/:id', async (request: Request, env: Env) => {
  try {
    const { id } = request.params;
    
    // Essayer de récupérer depuis le cache
    const cached = await env.GAMES_CACHE.get(id);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Si pas en cache, récupérer depuis la base de données
    const game = await getGame(id);
    if (!game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mettre en cache pour les prochaines requêtes
    await env.GAMES_CACHE.put(id, JSON.stringify(game), { expirationTtl: 3600 });

    return new Response(JSON.stringify(game), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorHandler(error);
  }
});

// Gestionnaire des WebSocket
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
          const game = await getGame(data.gameId);
          if (game) {
            server.send(JSON.stringify({ type: 'GAME_STATE', data: game }));
          }
          break;
        
        case 'GAME_ACTION':
          // Traiter l'action et sauvegarder
          await saveGame(data.gameId, data.gameState);
          // Mettre à jour le cache
          await env.GAMES_CACHE.put(data.gameId, JSON.stringify(data.gameState), {
            expirationTtl: 3600
          });
          break;
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      server.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
};

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

    // Gestion des WebSocket
    if (request.headers.get('Upgrade') === 'websocket') {
      return websocketHandler(request, env);
    }

    // Routes HTTP normales
    const response = await router.handle(request, env);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  },
};