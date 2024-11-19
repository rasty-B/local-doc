import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import { z } from 'zod';
import { mkdir } from 'fs/promises';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '../../dist');
const VECTOR_PATH = process.env.VECTORS_PATH || './data/vectors';
const DB_PATH = process.env.DB_PATH || './data/db';
const UPLOADS_PATH = './uploads';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize database
async function initializeDatabase() {
  await mkdir(DB_PATH, { recursive: true });
  
  const db = await open({
    filename: join(DB_PATH, 'assistant.db'),
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA journal_mode = WAL');
  
  // Create tables if they don't exist
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
  `);

  return db;
}

// Ensure required directories exist
async function ensureDirectories() {
  await mkdir(VECTOR_PATH, { recursive: true });
  await mkdir(UPLOADS_PATH, { recursive: true });
}

// File upload configuration
const upload = multer({
  dest: UPLOADS_PATH,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Serve static files
app.use(express.static(DIST_DIR));
app.use(express.json());

// Initialize and start server
async function startup() {
  try {
    await ensureDirectories();
    const db = await initializeDatabase();
    console.log('Database initialized successfully');

    // WebSocket connection handling
    wss.on('connection', (ws) => {
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          const MessageSchema = z.object({
            type: z.enum(['chat', 'query']),
            content: z.string(),
            projectId: z.string(),
          });

          const validatedData = MessageSchema.parse(data);
          
          if (validatedData.type === 'chat') {
            const response = "Response will be implemented with Ollama integration";
            ws.send(JSON.stringify({ type: 'response', content: response }));
          }
        } catch (error) {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid request' }));
        }
      });
    });

    // File upload endpoint
    app.post('/api/upload', upload.array('files'), async (req, res) => {
      try {
        res.json({ message: 'Files processed successfully' });
      } catch (error) {
        res.status(500).json({ error: 'File processing failed' });
      }
    });

    // Start server
    const port = process.env.PORT || 8080;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize:', error);
    process.exit(1);
  }
}

startup();