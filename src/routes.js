// src/routes.js
import express from 'express';
const router = express.Router();
import pool from './db.js';

/**
 * GET /api/buildings
 * Return list of buildings to populate the frontend selector.
 */
router.get('/buildings', async (req, res) => {
  try {
    const r = await pool.query('SELECT building_id, building_name FROM BUILDING ORDER BY building_id');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

/**
 * POST /api/scan
 * Body: { qr_value, building_id, action, scanned_by? }
 * Inserts a scan log entry into EntryExitLog. Server timestamp used by default.
 */
router.post('/scan', async (req, res) => {
  try {
    const { qr_value, building_id, action, scanned_by } = req.body;
    if (!qr_value || !building_id || !action) {
      return res.status(400).json({ error: 'Missing fields. Required: qr_value, building_id, action' });
    }
    if (!['entry','exit'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be entry or exit' });
    }

    // Validate building exists
    const b = await pool.query('SELECT building_id FROM BUILDING WHERE building_id = $1', [building_id]);
    if (b.rowCount === 0) {
      return res.status(400).json({ error: 'Unknown building_id' });
    }

    const insert = await pool.query(
      `INSERT INTO EntryExitLog (qr_value, building_id, action, scanned_by)
       VALUES ($1, $2, $3, $4) RETURNING log_id, timestamp`,
      [qr_value, building_id, action, scanned_by || null]
    );

    res.json({
      success: true,
      log_id: insert.rows[0].log_id,
      timestamp: insert.rows[0].timestamp
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

/**
 * GET /api/people-inside
 * Returns JSON array with people-inside counts per building.
 * This implements your provided SQL logic.
 */
router.get('/people-inside', async (req, res) => {
  try {
    const query = `
      WITH last_actions AS (
        SELECT qr_value, building_id, action,
               ROW_NUMBER() OVER (
                 PARTITION BY qr_value, building_id
                 ORDER BY timestamp DESC
               ) AS rn
        FROM EntryExitLog
      )
      SELECT b.building_id, b.building_name, COUNT(*)::int AS people_inside
      FROM last_actions la
      JOIN BUILDING b ON la.building_id = b.building_id
      WHERE rn = 1 AND action = 'entry'
      GROUP BY b.building_id, b.building_name
      ORDER BY b.building_id;
    `;
    const r = await pool.query(query);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
});

export default router;
