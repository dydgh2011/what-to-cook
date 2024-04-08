import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { ROLE_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const role = this.reflector.getAllAndOverride<string>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // this route is public so anyone can access
    if (isPublic) {
      return true;
    }

    // this route is public so anyone can access without any roles (admin, user, guest)
    if (!role) {
      return true;
    }

    if (role === 'user') {
      return true;
    } else {
      // admin
      const validUser = await this.authService.checkSecurityLevel(
        request.user,
        role,
      );
      if (validUser) {
        return true;
      } else {
        return false;
      }
    }
  }
}
