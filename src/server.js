// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';
import pool from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Accept JSON bodies
app.use(express.json());

// CORS: allow your frontend's origin (or all origins in dev)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({
  origin: FRONTEND_ORIGIN
}));

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// routes
app.use('/api', routes);

// Start server after successfully connecting to DB
async function start() {
  try {
    // quick DB check
    await pool.query('SELECT 1');
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database', err);
    process.exit(1);
  }
}

start();
