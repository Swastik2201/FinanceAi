import { Router, Response } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';
import { dbStore } from '../models/store';

const router = Router();

// GET /api/users/me - Return authenticated user's profile
router.get('/me', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User identity not found',
      });
    }

    const { uid, email, name, picture } = req.user;
    const userProfile = dbStore.getOrCreateUser(uid, email, name, picture);

    return res.status(200).json({
      success: true,
      user: {
        id: userProfile.id,
        firebaseUid: userProfile.firebaseUid,
        name: userProfile.name,
        email: userProfile.email,
        photoURL: userProfile.photoURL || null,
        currency: userProfile.currency || 'INR',
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile',
    });
  }
});

export default router;
