import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { app } from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let dbPath: string;

function getDbPath(): string {
  try {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'life-restart.db');
  } catch {
    return path.join(process.cwd(), 'life-restart.db');
  }
}

function createConnection() {
  dbPath = getDbPath();
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}

export const db = createConnection();
export { dbPath };
