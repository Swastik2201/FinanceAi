import { Router, Request, Response } from 'express';
import { dbStore } from '../models/store';

const router = Router();

// GET /api/bill-splits
router.get('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const splits = dbStore.getUserBillSplits(firebaseUid);
  res.json({ success: true, billSplits: splits });
});

// POST /api/bill-splits
router.post('/', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const { title, category, totalAmount, date, paidBy, members } = req.body;

  if (!title || !totalAmount || !members || !Array.isArray(members)) {
    return res.status(400).json({ success: false, error: 'Title, totalAmount, and members are required' });
  }

  const splitMembers = members.map((m: any, idx: number) => ({
    id: `m_${Date.now()}_${idx}`,
    name: m.name,
    amount: Number(m.amount),
    settled: Boolean(m.settled),
  }));

  const newSplit = dbStore.addBillSplit({
    firebaseUid,
    title,
    category: category || 'General',
    totalAmount: Number(totalAmount),
    date: date || new Date().toISOString().split('T')[0],
    paidBy: paidBy || 'User',
    members: splitMembers,
    settled: splitMembers.every((m) => m.settled),
  });

  res.status(201).json({ success: true, billSplit: newSplit });
});

// PATCH /api/bill-splits/:id/members/:memberId/settle
router.patch('/:id/members/:memberId/settle', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const { id, memberId } = req.params;
  const updated = dbStore.toggleMemberSettled(firebaseUid, id, memberId);

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Bill split or member not found' });
  }

  res.json({ success: true, billSplit: updated });
});

// DELETE /api/bill-splits/:id
router.delete('/:id', (req: Request, res: Response) => {
  const firebaseUid = (req as any).user?.uid || 'user_demo_123';
  const { id } = req.params;
  const deleted = dbStore.deleteBillSplit(firebaseUid, id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Bill split not found' });
  }

  res.json({ success: true, message: 'Bill split removed' });
});

export default router;
