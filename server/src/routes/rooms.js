import express from 'express';
import { query } from '../../db/index.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM rooms ORDER BY room_number ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Add a new room
router.post('/', async (req, res) => {
  try {
    const { room_number, room_type, price_per_night, status } = req.body;
    
    // Check if room exists
    const exists = await query('SELECT * FROM rooms WHERE room_number = $1', [room_number]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const result = await query(
      'INSERT INTO rooms (room_number, room_type, price_per_night, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_number, room_type, price_per_night, status || 'AVAILABLE']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ message: 'Error adding room' });
  }
});

// Update room status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await query(
      'UPDATE rooms SET status = $1 WHERE room_id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({ message: 'Error updating room status' });
  }
});

// Delete a room
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM rooms WHERE room_id = $1', [id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room' });
  }
});

export default router;
