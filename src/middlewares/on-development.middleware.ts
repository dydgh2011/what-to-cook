import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DevelopmentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // return res
    //   .status(403)
    //   .send('Access to this endpoint is restricted in development mode');
    return res.render('pages/on-development', { user: null });
    next();
  }
}
