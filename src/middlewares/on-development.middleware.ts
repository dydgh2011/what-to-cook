import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DevelopmentMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(req: Request, res: Response, _next: NextFunction) {
    return res.render('pages/on-development', { user: null });
  }
}
