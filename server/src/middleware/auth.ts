import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/database';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const DEMO_USER: AuthenticatedUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@gapzero.ai',
};

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development mode, allow default demo user if header is not present,
      // but if explicit "x-guest-mode" or running in strict mode, handle appropriately
      if (process.env.NODE_ENV !== 'production') {
        req.user = DEMO_USER;
        return next();
      }
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Missing Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Handle mock/demo token for development & testing
    if (token === 'demo-token' || token.startsWith('mock-') || token === 'test-token') {
      req.user = DEMO_USER;
      return next();
    }

    // Verify token with Supabase if configured
    if (supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired session token.',
        });
      }

      req.user = {
        id: user.id,
        email: user.email || 'user@gapzero.ai',
      };
      return next();
    }

    // Fallback if Supabase is not configured yet (development mode)
    req.user = {
      id: token.length > 10 ? token.substring(0, 36) : DEMO_USER.id,
      email: 'user@gapzero.ai',
    };
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed.',
    });
  }
}
