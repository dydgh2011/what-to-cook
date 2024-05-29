import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_AUTH_ID,
      clientSecret: process.env.FACEBOOK_AUTH_SECRET,
      callbackURL: '/auth/facebook/callback',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }
  //public_profile,email
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { id, name } = profile;
      const username = name.familyName + ' ' + name.givenName;
      const user = {
        id,
        username,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
