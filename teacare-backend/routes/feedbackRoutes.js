import express from 'express';
import {
    changeFeedbackStatus,
    createFeedback,
    deleteFeedback,
    listFeedback,
    listPublishedFeedback,
} from '../controllers/feedbackController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/published', listPublishedFeedback);
router.get('/admin', requireAdmin, listFeedback);
router.patch('/admin/:id', requireAdmin, changeFeedbackStatus);
router.delete('/admin/:id', requireAdmin, deleteFeedback);

export default router;
