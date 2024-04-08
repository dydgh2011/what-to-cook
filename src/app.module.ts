import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './auth/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { DevelopmentMiddleware } from './middlewares/on-development.middleware';

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
          autoLoadEntities: true,
        };
        if (configService.get('STAGE') === 'local') {
          obj = Object.assign(obj, {
            syncronize: true,
            logging: true,
          });
        }
        return obj;
      },
    }),
    BoardModule,
    UserModule,
    AuthModule,
    ClaimModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DevelopmentMiddleware)
      .forRoutes(
        { path: '/signup', method: RequestMethod.ALL },
        { path: '/login', method: RequestMethod.ALL },
        { path: '/board', method: RequestMethod.ALL },
        { path: '/user', method: RequestMethod.ALL },
      );
  }
}
