import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/routes/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

//FIXME: try to write test case for this if needed
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
    private reflector: Reflector,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: { sub: number; username: string }) {
    const user = await this.userService.getUserById(payload.sub);
    if (
      !user ||
      user.id !== payload.sub ||
      user.username !== payload.username
    ) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, username: payload.username };
  }
}
