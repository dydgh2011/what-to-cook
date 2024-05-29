import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/routes/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { TokenPayload } from './dto/req.dto';

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

  async validate(payload: TokenPayload) {
    const user = await this.userService.getUserById({
      id: payload.id,
      userFields: [
        'username',
        'verificationMethod',
        'verificationValue',
        'email',
        'password',
        'accessTokenVersion',
        'refreshTokenVersion',
        'emailConfirmed',
        'role',
      ],
    });
    if (!user || user.id !== payload.id) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
