import { UserService } from 'src/routes/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ActorGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actor = request.user;
    const target_id = request.body.verificationValue;
    if (!target_id) return false;
    if (!actor) return false;
    if (actor.role === 'ADMIN') {
      return true;
    } else {
      if (actor.verificationValue !== target_id) {
        return false;
      } else {
        return true;
      }
    }
  }
}
