console.log("Node.js version:", process.version);
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: [
      'https://www.teacareservices.com',
      'https://teacareservices.com',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Teacare Services Pvt Ltd API',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Teacare Services Pvt Ltd API running',
    version: '2.0',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Teacare Services Pvt Ltd API running on port ${PORT}`);
});
