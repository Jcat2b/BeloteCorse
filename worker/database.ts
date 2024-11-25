import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:belote.db',
});

export async function initDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      rating INTEGER DEFAULT 1000,
      games_played INTEGER DEFAULT 0,
      games_won INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS game_history (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      action_data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (player_id) REFERENCES players(id)
    )
  `);
}

export async function saveGame(gameId: string, gameState: any) {
  try {
    await client.execute({
      sql: 'INSERT OR REPLACE INTO games (id, state, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      args: [gameId, JSON.stringify(gameState)]
    });
  } catch (error) {
    console.error('Error saving game:', error);
    throw error;
  }
}

export async function getGame(gameId: string) {
  try {
    const result = await client.execute({
      sql: 'SELECT state FROM games WHERE id = ?',
      args: [gameId]
    });
    return result.rows[0] ? JSON.parse(result.rows[0].state as string) : null;
  } catch (error) {
    console.error('Error getting game:', error);
    throw error;
  }
}

export async function savePlayer(player: any) {
  try {
    await client.execute({
      sql: 'INSERT OR REPLACE INTO players (id, username, rating) VALUES (?, ?, ?)',
      args: [player.id, player.username, player.rating]
    });
  } catch (error) {
    console.error('Error saving player:', error);
    throw error;
  }
}

export async function updatePlayerStats(playerId: string, won: boolean) {
  try {
    await client.execute({
      sql: 'UPDATE players SET games_played = games_played + 1, games_won = games_won + ? WHERE id = ?',
      args: [won ? 1 : 0, playerId]
    });
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
}

export async function saveGameAction(action: any) {
  try {
    await client.execute({
      sql: 'INSERT INTO game_history (id, game_id, player_id, action_type, action_data) VALUES (?, ?, ?, ?, ?)',
      args: [
        action.id,
        action.gameId,
        action.playerId,
        action.type,
        JSON.stringify(action.data)
      ]
    });
  } catch (error) {
    console.error('Error saving game action:', error);
    throw error;
  }
}