import { Injectable, NestMiddleware } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: any, res: any, next: () => void) {
    Sentry.Handlers.requestHandler()(req, res, next);
  }
}
