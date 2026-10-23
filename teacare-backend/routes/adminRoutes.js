import express from 'express';
import { rateLimit } from 'express-rate-limit';
import {
    checkAdminSession,
    loginAdmin,
    logoutAdmin,
    requireAdmin,
} from '../middleware/adminAuth.js';

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});

router.post('/login', loginLimiter, loginAdmin);
router.get('/session', requireAdmin, checkAdminSession);
router.post('/logout', logoutAdmin);

export default router;
