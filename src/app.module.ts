import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './routes/board/board.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClaimModule } from './routes/claim/claim.module';
import { SearchModule } from './routes/search/search.module';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';
import openAIConfig from './config/openAI.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JWTAuthGuard } from './auth/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { BaseUrlInterceptor } from './intercepters/base-value.intercepter';
import { UserEntity } from './entities/user.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import { NotificationEntity } from './entities/notification.entity';
import { ImageEntity } from './entities/image.entity';
import { ClaimEntity } from './entities/claim.entity';
import { CommentEntity } from './entities/comment.entity';
import { FriendRequestEntity } from './entities/friends-request.entity';
import { PostEntity } from './entities/post.entity';
import { NotificationModule } from './routes/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      load: [postgresConfig, jwtConfig, openAIConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          database: configService.get('postgres.database'),
          entities: [
            ClaimEntity,
            CommentEntity,
            FriendRequestEntity,
            ImageEntity,
            NotificationEntity,
            PostEntity,
            UserEntity,
          ],
        };
        if (process.env.NODE_ENV === 'development') {
          obj = Object.assign(obj, {
            syncronize: false,
            logging: true,
          });
        } else {
          obj = Object.assign(obj, {
            syncronize: false,
            logging: false,
          });
        }
        return obj;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 100,
      },
    ]),
    BoardModule,
    UserModule,
    AuthModule,
    ClaimModule,
    SearchModule,
    MailModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: BaseUrlInterceptor,
    },
  ],
})
export class AppModule {}
