import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['accessToken'];
    if (token) {
      req.headers['authorization'] = `Bearer ${token}`; // Add token to Authorization header
    }
    next();
  }
}
