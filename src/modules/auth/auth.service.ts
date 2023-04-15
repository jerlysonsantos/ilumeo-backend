import { Response } from 'express';

import { Injectable, Inject } from '@injection-dependency';

import { generateAccessToken } from '../../helpers/jwt.helper';
import { AuthRepository } from './repository/auth.repository';

@Injectable('authService')
class AuthService {
  @Inject('authRepository')
  authRepository: AuthRepository;

  constructor() {}

  async autheticate(userCode: string, res: Response): Promise<Response> {
    try {
      const user = await this.authRepository.getOneUser(userCode);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const token = generateAccessToken(userCode);

      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { AuthService };
