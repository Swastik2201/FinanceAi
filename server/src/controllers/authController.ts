import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { prisma } from '../config/db.js';

export const syncUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({ success: false, error: 'Unauthorized user payload' });
      return;
    }

    const { uid } = req.user;
    const email = req.user.email || req.body.email || '';
    const name = req.body.name || req.user.name || (email ? email.split('@')[0] : 'User');
    const photoURL = req.body.photoURL || req.user.picture || null;
    const provider = req.body.provider || 'password';

    if (!email) {
      res.status(400).json({ success: false, error: 'User email is required' });
      return;
    }

    // Upsert database record using verified Firebase UID
    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        name,
        email,
        photoURL,
        provider,
      },
      create: {
        firebaseUid: uid,
        name,
        email,
        photoURL,
        provider,
        currency: 'USD',
      },
    });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        provider: user.provider,
        currency: user.currency,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error syncing user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to synchronize user profile with database',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({ success: false, error: 'Unauthorized user payload' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User profile not found in database' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile',
    });
  }
};
