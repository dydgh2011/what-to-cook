import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { IS_BYPASS_KEY } from 'src/decorators/bypass-email-verification.decorator';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const canBypass = this.reflector.getAllAndOverride<boolean>(IS_BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      request.user = undefined;
      return true;
    } else {
      const hasAuthHeader = request.headers.authorization;
      if (!hasAuthHeader) {
        return false;
      }
      const token = request.headers.authorization.split(' ')[1];
      const decodedToken: any = jwt.decode(token);
      if (!decodedToken) {
        throw new UnauthorizedException('Not valid Token');
      }
      if (
        decodedToken &&
        decodedToken.exp &&
        Date.now() >= decodedToken.exp * 1000
      ) {
        if (decodedToken.type === 'access') {
          throw new UnauthorizedException('Access token has expired');
        } else if (decodedToken.type === 'refresh') {
          throw new UnauthorizedException('Refresh token has expired');
        }
      }
      if (!canBypass) {
        if (!decodedToken.emailConfirmed) {
          throw new UnauthorizedException('email is not confirmed yet');
        }
      }
      return super.canActivate(context);
    }
  }
}
