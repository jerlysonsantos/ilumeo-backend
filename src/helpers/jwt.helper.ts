import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../modules/auth/models/user.model';

interface AuthenticatedRequest extends Request {
  user: User;
}

export const generateAccessToken = (userCode: string) => {
  return sign({ userCode }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
};

export const Authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Usuário não autorizado' });

  verify(token, process.env.TOKEN_SECRET as string, (err: any, user: User) => {
    if (err) return res.status(403);

    req.user = user;

    next();
  });
};
