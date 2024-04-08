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
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';

@Module({
  imports: [
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
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
  providers: [AuthService, LocalStrategy, UserService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
