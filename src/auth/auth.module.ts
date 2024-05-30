import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from 'src/routes/user/user.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/routes/user/user.module';
import { FriendRequestEntity } from 'src/entities/friends-request.entity';
import { AuthController } from './auth.controller';
import { GoogleAuthStrategy } from './google.strategy';
import { FacebookAuthStrategy } from './facebook.strategy';
import { TwitterAuthStrategy } from './twitter.strategy';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity]),
    PassportModule,
    UserModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('jwt.secret'),
          signOptions: { expiresIn: configService.get('jwt.expiresIn') },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    MailService,
    LocalStrategy,
    JwtStrategy,
    GoogleAuthStrategy,
    FacebookAuthStrategy,
    TwitterAuthStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
