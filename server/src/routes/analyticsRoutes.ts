import { Router, Request, Response } from 'express';
import { dbStore } from '../models/store';

const router = Router();

// GET /api/analytics
router.get('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const analytics = dbStore.getAnalyticsData(firebaseUid);
  res.json({ success: true, analytics });
});

export default router;
