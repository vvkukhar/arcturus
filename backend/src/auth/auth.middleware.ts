import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../lib/config';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.toString().replace('Bearer ', '');
  if (token !== appConfig.adminToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}