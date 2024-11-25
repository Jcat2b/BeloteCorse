const { createClient } = require('@libsql/client');

async function setupDatabase() {
  const client = createClient({
    url: 'file:belote.db',
  });

  try {
    // Création des tables
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

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    await client.close();
  }
}

setupDatabase();