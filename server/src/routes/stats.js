import express from 'express';
import { query } from '../../db/index.js';

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const stats = await Promise.all([
      query('SELECT COUNT(*) as total FROM rooms'),
      query("SELECT COUNT(*) as available FROM rooms WHERE status = 'AVAILABLE'"),
      query("SELECT COUNT(*) as occupied FROM rooms WHERE status = 'OCCUPIED'"),
      query("SELECT COUNT(*) as maintenance FROM rooms WHERE status = 'MAINTENANCE'"),
      query('SELECT COUNT(*) as guests FROM guests'),
      query("SELECT COUNT(*) as active_reservations FROM reservations WHERE status IN ('PENDING', 'CHECKED_IN')"),
    ]);

    const recentBookings = await query(`
      SELECT 
        r.reservation_id,
        g.full_name as guest,
        rm.room_number as room,
        r.status,
        r.booking_date as date
      FROM reservations r
      JOIN guests g ON r.guest_id = g.guest_id
      JOIN rooms rm ON r.room_id = rm.room_id
      ORDER BY r.booking_date DESC
      LIMIT 5
    `);

    res.json({
      metrics: {
        totalRooms: parseInt(stats[0].rows[0].total),
        availableToday: parseInt(stats[1].rows[0].available),
        occupied: parseInt(stats[2].rows[0].occupied),
        maintenance: parseInt(stats[3].rows[0].maintenance),
        totalGuests: parseInt(stats[4].rows[0].guests),
        activeReservations: parseInt(stats[5].rows[0].active_reservations),
      },
      recentBookings: recentBookings.rows
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
