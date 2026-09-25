import express from 'express';
import { createAppointment, getAppointments, replyToAppointment, updateAppointmentStatusController } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAppointments);
router.patch('/status', updateAppointmentStatusController);
router.post('/reply', replyToAppointment);

export default router;