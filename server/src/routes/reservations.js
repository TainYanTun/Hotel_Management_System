import express from 'express';
import { query } from '../../db/index.js';

const router = express.Router();

// GET all reservations with guest and room info
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        r.reservation_id,
        r.booking_date,
        r.check_in_date,
        r.check_out_date,
        r.status,
        g.full_name as guest_name,
        g.phone,
        g.email,
        rm.room_number,
        rm.room_type,
        rm.price_per_night
      FROM reservations r
      JOIN guests g ON r.guest_id = g.guest_id
      JOIN rooms rm ON r.room_id = rm.room_id
      ORDER BY r.booking_date DESC
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create reservation
router.post('/', async (req, res) => {
  const { guest_id, room_id, check_in_date, check_out_date, status } = req.body;
  
  if (!guest_id || !room_id || !check_in_date || !check_out_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await query(
      'INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [guest_id, room_id, check_in_date, check_out_date, status || 'PENDING']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await query(
      'UPDATE reservations SET status = $1 WHERE reservation_id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating reservation status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE reservation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM reservations WHERE reservation_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
