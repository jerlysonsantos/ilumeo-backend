import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../modules/auth/models/user.model';
import { AuthRepository } from '../modules/auth/repository/auth.repository';

export interface AuthenticatedRequest<T = any> extends Request<{}, any, T> {
  user: User;
}

export const generateAccessToken = (userCode: string) => {
  return sign({ userCode }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
};

export const Authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Usuário não autorizado' });

  verify(token, process.env.TOKEN_SECRET as string, async (err: any, user: User) => {
    if (err) return res.status(403);

    const authRepository = new AuthRepository();

    req.user = await authRepository.getOneUser(user.userCode);

    next();
  });
};
