import { Response, Request } from 'express';

import { AuthService } from './auth.service';

import { Post, Controller } from '@routers';
import { Inject } from '@injection-dependency';

import { AuthDto } from './dto/auth.dto';
import { ValidateBody } from '../../helpers/validate-body.helper';

@Controller('/auth')
class AuthController {
  @Inject('authService')
  private authService: AuthService;

  @Post('/', ValidateBody(AuthDto))
  async authenticate(req: Request<{}, any, AuthDto>, res: Response): Promise<Response> {
    try {
      return this.authService.autheticate(req.body.userCode, res);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { AuthController };
