import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import guestsRoutes from './routes/guests.js';
import reservationsRoutes from './routes/reservations.js';
import auditLogsRoutes from './routes/auditLogs.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/stats', statsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel Management API is running' });
});

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
