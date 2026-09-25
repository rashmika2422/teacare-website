import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// API routes — frontend is served by Next.js on port 3000
app.use('/api/appointments', appointmentRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Teacare API running', version: '2.0' });
});

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server live on http://127.0.0.1:${PORT}`));