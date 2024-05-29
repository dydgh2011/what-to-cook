import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendVerificationMail(user?: UserEntity, token?: string) {
    const emailIcon = fs.readFileSync(
      join(__dirname, '../../', 'public/img/mail-open-check-svgrepo-com.png'),
    );
    const logo = fs.readFileSync(
      join(__dirname, '../../', 'public/img/mail-logo.png'),
    );
    const mailHeader = fs.readFileSync(
      join(__dirname, '../../', 'public/img/verifyEmail.png'),
    );

    const emailIconCid = 'emailIcon';
    const logoCid = 'logo';
    const mailHeaderCid = 'mailHeader';

    return await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('SMTP_AUTH_USER'),
      subject: '오늘 뭐 해먹지? - 이메일 인증',
      template: 'email-verification',
      context: {
        baseURL: this.configService.get<string>('BASE_URL'),
        token: token,
        emailIconCid,
        logoCid,
        mailHeaderCid,
      },
      attachments: [
        {
          filename: 'emailVerifIcon.png',
          content: emailIcon,
          encoding: 'base64',
          cid: emailIconCid,
        },
        {
          filename: 'logo.png',
          content: logo,
          encoding: 'base64',
          cid: logoCid,
        },
        {
          filename: 'mailHeader.png',
          content: mailHeader,
          encoding: 'base64',
          cid: mailHeaderCid,
        },
      ],
    });
  }

  async sendPasswordResetMail(user: UserEntity, token: string) {
    const emailIcon = fs.readFileSync(
      join(__dirname, '../../', 'public/img/reset-password.png'),
    );
    const logo = fs.readFileSync(
      join(__dirname, '../../', 'public/img/mail-logo.png'),
    );
    const mailHeader = fs.readFileSync(
      join(__dirname, '../../', 'public/img/reset-password-email-icon.png'),
    );

    const emailIconCid = 'emailIcon';
    const logoCid = 'logo';
    const mailHeaderCid = 'mailHeader';
    return await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('SMTP_AUTH_USER'),
      subject: '오늘 뭐 해먹지? - 비밀번호 재설정',
      template: 'reset-password',
      context: {
        baseURL: this.configService.get<string>('BASE_URL'),
        userId: user.verificationValue,
        token: token,
        emailIconCid,
        logoCid,
        mailHeaderCid,
      },
      attachments: [
        {
          filename: 'emailIcon.png',
          content: emailIcon,
          encoding: 'base64',
          cid: emailIconCid,
        },
        {
          filename: 'logo.png',
          content: logo,
          encoding: 'base64',
          cid: logoCid,
        },
        {
          filename: 'mailHeader.png',
          content: mailHeader,
          encoding: 'base64',
          cid: mailHeaderCid,
        },
      ],
    });
  }
}
