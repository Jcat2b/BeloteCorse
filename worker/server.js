import express from 'express';
import expressWs from 'express-ws';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { webcrypto } from 'crypto';

const { randomUUID } = webcrypto;
const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'belote.db'));
const app = express();
const wsInstance = expressWs(app);

// Middleware
app.use(express.json());

// Configuration CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Initialisation de la base de données
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    rating INTEGER DEFAULT 1000,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_history (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
  );
`);

// Routes
app.post('/game/create', (req, res) => {
  try {
    const { creatorId } = req.body;
    const gameId = randomUUID();
    
    const stmt = db.prepare('INSERT INTO games (id, state) VALUES (?, ?)');
    stmt.run(gameId, JSON.stringify({
      id: gameId,
      creatorId,
      players: [],
      status: 'WAITING',
      createdAt: Date.now()
    }));

    res.json({ gameId });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/game/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;
    
    const game = db.prepare('SELECT state FROM games WHERE id = ?').get(id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameState = JSON.parse(game.state);
    gameState.players.push(playerId);
    
    db.prepare('UPDATE games SET state = ? WHERE id = ?').run(
      JSON.stringify(gameState),
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// WebSocket endpoint
app.ws('/game', (ws, req) => {
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      
      switch (data.type) {
        case 'JOIN_GAME':
          const game = db.prepare('SELECT state FROM games WHERE id = ?').get(data.gameId);
          if (game) {
            ws.send(JSON.stringify({
              type: 'GAME_STATE',
              data: JSON.parse(game.state)
            }));
          }
          break;
        
        case 'GAME_ACTION':
          db.prepare('UPDATE games SET state = ? WHERE id = ?').run(
            JSON.stringify(data.gameState),
            data.gameId
          );
          
          // Broadcast aux autres joueurs
          wsInstance.getWss().clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
              client.send(JSON.stringify({
                type: 'GAME_UPDATE',
                data: data.gameState
              }));
            }
          });
          break;
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});