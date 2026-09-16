import type { User } from '../Modules/User/Entities/User.js';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    csrfToken?: string;
    flash?: { type: 'success' | 'error'; message: string }[];
  }
}

declare global {
  namespace Express {
    interface Request {
      /** Set by the currentUser middleware when a session is present. */
      user?: User;
    }
  }
}
