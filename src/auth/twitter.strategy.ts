import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-twitter';

@Injectable()
export class TwitterAuthStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_COMSUMER_ID,
      consumerSecret: process.env.TWITTER_COMSUMER_SECRET,
      clientType: 'confidential',
      callbackURL: '/auth/twitter/callback',
      scope: ['tweet.read', 'users.read', 'offline.access'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { id, username } = profile;
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
