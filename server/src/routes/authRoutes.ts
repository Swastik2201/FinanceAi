import { Router } from 'express';
import { syncUser, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protected sync endpoint
router.post('/sync', authMiddleware, syncUser);

// Protected profile retrieval endpoint
router.get('/me', authMiddleware, getMe);

export default router;
