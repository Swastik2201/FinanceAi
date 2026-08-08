import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../config/firebaseAdmin.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Access denied. Missing or invalid Authorization header.',
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1].trim();

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access denied. No authentication token provided.',
    });
    return;
  }

  try {
    const decodedToken = await verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || (decodedToken.email ? decodedToken.email.split('@')[0] : 'User'),
      picture: decodedToken.picture,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Unauthorized. Invalid authentication token.',
    });
  }
};
