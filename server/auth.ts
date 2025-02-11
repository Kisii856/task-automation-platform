
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '24h' });
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
    const user = await db.select().from(users).where(eq(users.id, decoded.userId));
    
    if (!user.length) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: error instanceof Error ? error.message : 'Authentication failed' });
  }
}
