import express from 'express';
import { createAppointment, getAppointments, replyToAppointment, updateAppointmentStatusController } from '../controllers/appointmentController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/', requireAdmin, getAppointments);
router.patch('/status', requireAdmin, updateAppointmentStatusController);
router.post('/reply', requireAdmin, replyToAppointment);

export default router;