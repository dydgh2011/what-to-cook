import { MailService } from './../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/routes/user/user.service';
import { UserEntity } from 'src/entities/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateUserReqDto } from 'src/routes/user/dto/req.dto';
import { VerificationMethod } from 'src/entities/data-types-for-entities';
import { TokenPayload } from './dto/req.dto';
import * as crypto from 'crypto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async logIn(user: UserEntity) {
    // put email confirmed in tokens
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signUp(userInfo: CreateUserReqDto) {
    const user = await this.userService.createUser(userInfo);

    if (userInfo.verificationMethod === VerificationMethod.LOCAL) {
      const token = await this.generateMailVerificationToken(user);
      this.mailService.sendVerificationMail(user, token);
    }

    return await this.logIn(user);
  }

  async localValidation(
    localId: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.getUser({
      verificationMethod: VerificationMethod.LOCAL,
      verificationValue: localId,
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
    if (user) {
      const match = await compare(password, user.password);
      if (match) return user;
    }
    return null;
  }

  async resendVerificationMail(user: UserEntity) {
    const userWithToken = await this.userService.getUserById({
      id: user.id,
      userFields: ['emailVerificationToken'],
    });
    await this.mailService.sendVerificationMail(
      user,
      userWithToken.emailVerificationToken,
    );
    return;
  }

  async verifyEmail(user: UserEntity, token: string) {
    if (user.emailConfirmed) {
      throw new UnauthorizedException('user is already email confirmed');
    } else {
      const userWithToken = await this.userService.getUserById({
        id: user.id,
        userFields: ['emailVerificationToken'],
      });
      if (token === userWithToken.emailVerificationToken) {
        return await this.userService.updateUserById({
          id: user.id,
          column: 'emailConfirmed',
          value: 'true',
        });
      } else {
        throw new UnauthorizedException('Token does not match');
      }
    }
  }

  async sendResetPasswordMail(userId: string) {
    const user = await this.userService.getUser({
      verificationMethod: VerificationMethod.LOCAL,
      verificationValue: userId,
      userFields: ['email', 'verificationValue'],
    });
    if (user) {
      const token = await this.generatePasswordResetToken(user);
      return await this.mailService.sendPasswordResetMail(user, token);
    } else {
      throw new HttpException('no user found', 400);
    }
  }

  async resetPassword(userId: string, newPassword: string, token: string) {
    const user = await this.userService.getUser({
      verificationMethod: VerificationMethod.LOCAL,
      verificationValue: userId,
      userFields: ['email', 'passwordResetToken'],
    });
    if (user) {
      if (user.passwordResetToken === token) {
        const encryptedPassword = await hash(
          newPassword,
          parseInt(process.env.SALT_ROUNDS, 10),
        );
        return await this.userService.updateUser({
          verificationMethod: VerificationMethod.LOCAL,
          verificationValue: userId,
          column: 'password',
          value: encryptedPassword,
        });
      }
    }
    throw new HttpException('no user found or token does not match', 400);
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    const newTokenVersion = (user.accessTokenVersion + 1) % 10;
    await this.userService.updateUserById({
      id: user.id,
      column: 'accessTokenVersion',
      value: newTokenVersion,
    });
    return await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        tokenVersion: newTokenVersion,
        type: 'access',
        emailConfirmed: user.emailConfirmed,
      },
      {
        expiresIn: '30m',
      },
    );
  }

  async generateRefreshToken(user: UserEntity): Promise<string> {
    const newTokenVersion = (user.refreshTokenVersion + 1) % 10;
    await this.userService.updateUserById({
      id: user.id,
      column: 'refreshTokenVersion',
      value: newTokenVersion,
    });
    return await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        tokenVersion: newTokenVersion,
        type: 'refresh',
        emailConfirmed: user.emailConfirmed,
      },
      {
        expiresIn: '7d',
      },
    );
  }

  async generateMailVerificationToken(user: UserEntity): Promise<string> {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 10;
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, alphabet.length);
      token += alphabet.charAt(randomIndex);
    }

    await this.userService.updateUserById({
      id: user.id,
      column: 'emailVerificationToken',
      value: token,
    });
    return token;
  }

  async generatePasswordResetToken(user: UserEntity): Promise<string> {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 10;
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, alphabet.length);
      token += alphabet.charAt(randomIndex);
    }

    await this.userService.updateUserById({
      id: user.id,
      column: 'passwordResetToken',
      value: token,
    });
    return token;
  }

  async checkSecurityLevel(payload: TokenPayload, role: string) {
    const user = await this.userService.getUserById({
      id: payload.id,
      userFields: ['role'],
    });
    if (user) {
      if (user.role === role) {
        return true;
      }
    }
    return false;
  }
}
