import { Router, Request, Response } from 'express';
import { dbStore } from '../models/store';

const router = Router();

// GET /api/subscriptions
router.get('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const subs = dbStore.getUserSubscriptions(firebaseUid);
  res.json({ success: true, subscriptions: subs });
});

// POST /api/subscriptions
router.post('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const { name, category, amount, billingCycle, nextRenewalDate, iconName } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ success: false, error: 'Name and amount are required' });
  }

  const newSub = dbStore.addSubscription({
    firebaseUid,
    name,
    category: category || 'General',
    amount: Number(amount),
    billingCycle: billingCycle || 'monthly',
    nextRenewalDate: nextRenewalDate || new Date().toISOString().split('T')[0],
    status: 'active',
    iconName: iconName || 'CreditCard',
  });

  res.status(201).json({ success: true, subscription: newSub });
});

// PATCH /api/subscriptions/:id/toggle
router.patch('/:id/toggle', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const { id } = req.params;
  const updated = dbStore.toggleSubscriptionStatus(firebaseUid, id);

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Subscription not found' });
  }

  res.json({ success: true, subscription: updated });
});

// DELETE /api/subscriptions/:id
router.delete('/:id', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const { id } = req.params;
  const deleted = dbStore.deleteSubscription(firebaseUid, id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Subscription not found' });
  }

  res.json({ success: true, message: 'Subscription removed' });
});

export default router;
