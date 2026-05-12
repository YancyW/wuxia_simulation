import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import path from 'path';
import { createRequire } from 'node:module';

let dbPath: string;

function getDbPath(): string {
  try {
    const req = createRequire(import.meta.url);
    const { app } = req('electron');
    return path.join(app.getPath('userData'), 'life-restart.db');
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
