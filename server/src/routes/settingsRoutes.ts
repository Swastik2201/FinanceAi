import { Router, Request, Response } from 'express';
import { dbStore } from '../models/store';

const router = Router();

// GET /api/settings
router.get('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const settings = dbStore.getUserSettings(firebaseUid);
  res.json({ success: true, settings });
});

// PUT /api/settings
router.put('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const updates = req.body;
  const updatedSettings = dbStore.updateUserSettings(firebaseUid, updates);
  res.json({ success: true, settings: updatedSettings });
});

export default router;
