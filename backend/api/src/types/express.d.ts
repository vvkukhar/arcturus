import { AuthUser } from '../modules/auth/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}