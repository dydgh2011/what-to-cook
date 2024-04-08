import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DevelopmentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    return res.render('pages/on-development', { user: null });
  }
}
