import { Router, Response } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';
import { dbStore } from '../models/store';

const router = Router();

// GET /api/dashboard/summary - Protected endpoint for user summary metrics
router.get('/summary', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing user authentication token',
      });
    }

    const rawPeriod = (req.query.period as string) || 'this_month';
    const validPeriods = ['this_month', 'last_month', 'last_3_months', 'this_year'];
    const period = validPeriods.includes(rawPeriod) ? rawPeriod : 'this_month';

    const summary = dbStore.getDashboardSummary(req.user.uid, period);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error fetching dashboard data',
    });
  }
});

// POST /api/dashboard/transactions - Helper endpoint to add mock/real transactions for testing empty/populated states
router.post('/transactions', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ success: false, error: 'Missing required transaction fields' });
    }

    const tx = dbStore.addTransaction({
      firebaseUid: req.user.uid,
      amount: Number(amount),
      type,
      category,
      description: description || '',
      date: date || new Date().toISOString(),
    });

    return res.status(201).json({ success: true, transaction: tx });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create transaction' });
  }
});

export default router;
