import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PAGE } from 'src/decorators/page.decorator';

@Injectable()
export class BaseUrlInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPage = this.reflector.getAllAndOverride<boolean>(IS_PAGE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPage) {
      return next.handle().pipe(
        map((data) => ({
          ...data,
          baseURL: this.configService.get('BASE_URL'),
        })),
      );
    } else {
      return next.handle();
    }
  }
}
