import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

const DB_PATH = process.env.DB_PATH || './data/db';

export async function initializeDatabase() {
  const dbFile = join(DB_PATH, 'assistant.db');
  
  // Ensure the database directory exists
  await import('fs/promises').then(fs => 
    fs.mkdir(DB_PATH, { recursive: true })
  );

  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  // Enable WAL mode for better concurrent access
  await db.exec('PRAGMA journal_mode = WAL');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_paths (
      project_id TEXT NOT NULL,
      path TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      PRIMARY KEY (project_id, path)
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      cron_expression TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      last_run DATETIME,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS schedule_paths (
      schedule_id TEXT NOT NULL,
      path TEXT NOT NULL,
      FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
      PRIMARY KEY (schedule_id, path)
    );

    CREATE TABLE IF NOT EXISTS embeddings (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      path TEXT NOT NULL,
      content TEXT NOT NULL,
      embedding BLOB NOT NULL,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_embeddings_project ON embeddings(project_id);
    CREATE INDEX IF NOT EXISTS idx_embeddings_path ON embeddings(path);
  `);

  return db;
}