import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel Management API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
