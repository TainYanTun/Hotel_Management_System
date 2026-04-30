import express from 'express';
import { query } from '../../db/index.js';
import { logAction } from '../utils/logger.js';

const router = express.Router();

// GET all guests
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM guests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching guests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET one guest
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM guests WHERE guest_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create guest
router.post('/', async (req, res) => {
  const { full_name, phone, email, address, id_passport } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: 'Full name is required' });
  }

  try {
    const result = await query(
      'INSERT INTO guests (full_name, phone, email, address, id_passport) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, phone, email, address, id_passport]
    );
    const guest = result.rows[0];
    await logAction(null, 'Added new guest', 'guest', guest.guest_id, `Name: ${full_name}`);
    res.status(201).json(guest);
  } catch (err) {
    console.error('Error creating guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update guest
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, email, address, id_passport } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: 'Full name is required' });
  }

  try {
    const result = await query(
      'UPDATE guests SET full_name = $1, phone = $2, email = $3, address = $4, id_passport = $5 WHERE guest_id = $6 RETURNING *',
      [full_name, phone, email, address, id_passport, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE guest
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM guests WHERE guest_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    await logAction(null, 'Deleted guest', 'guest', id, `Guest ID ${id} removed`);
    res.json({ message: 'Guest deleted successfully' });
  } catch (err) {
    console.error('Error deleting guest:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
