import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'life-restart.db');

export function runMigrations() {
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS saves (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      character_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      gender TEXT NOT NULL,
      age INTEGER NOT NULL DEFAULT 10,
      life_stage TEXT NOT NULL DEFAULT 'youth',
      martial_level TEXT NOT NULL DEFAULT 'beginner',
      sect_id TEXT,
      flags TEXT NOT NULL DEFAULT '[]',
      is_alive INTEGER NOT NULL DEFAULT 1,
      died_at INTEGER,
      death_cause TEXT,
      created_at TEXT NOT NULL,
      bone INTEGER NOT NULL DEFAULT 3,
      wits INTEGER NOT NULL DEFAULT 3,
      qi INTEGER NOT NULL DEFAULT 3,
      technique INTEGER NOT NULL DEFAULT 3,
      agility INTEGER NOT NULL DEFAULT 3,
      reputation INTEGER NOT NULL DEFAULT 0,
      honor INTEGER NOT NULL DEFAULT 0,
      constitution INTEGER NOT NULL DEFAULT 3
    );

    CREATE TABLE IF NOT EXISTS martial_arts_learned (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      art_id TEXT NOT NULL,
      proficiency TEXT NOT NULL DEFAULT 'beginner',
      proficiency_value INTEGER NOT NULL DEFAULT 1,
      learned_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      npc_name TEXT NOT NULL,
      relation_type TEXT NOT NULL,
      affinity INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_logs (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      choice_index INTEGER NOT NULL,
      life_stage TEXT NOT NULL,
      age INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  sqlite.close();
}

if (process.argv[1]?.endsWith('migrate.ts')) {
  runMigrations();
  console.log('Migrations complete.');
}
