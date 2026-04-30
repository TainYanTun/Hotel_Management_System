import express from 'express';
import { query } from '../../db/index.js';

const router = express.Router();

// GET all audit logs with user info
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.log_id,
        a.action,
        a.entity_type,
        a.entity_id,
        a.timestamp,
        a.details,
        u.username as user
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.user_id
      ORDER BY a.timestamp DESC
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET audit metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalLogs = await query('SELECT COUNT(*) FROM audit_logs');
    const activeUsers = await query('SELECT COUNT(DISTINCT user_id) FROM audit_logs');
    const actionsToday = await query("SELECT COUNT(*) FROM audit_logs WHERE timestamp >= CURRENT_DATE");
    
    res.json({
      totalLogs: totalLogs.rows[0].count,
      activeUsers: activeUsers.rows[0].count,
      actionsToday: actionsToday.rows[0].count
    });
  } catch (err) {
    console.error('Error fetching audit metrics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
