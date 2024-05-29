import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SentryFilter } from './filters/sentry.filter';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      debug: true,
    });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/api*',
      basicAuth({
        challenge: true,
        users: {
          [process.env.API_DOCS_USER]: process.env.API_DOCS_PASSWORD,
        },
      }),
    );
  }

  if (process.env.NODE_ENV === 'production') {
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new SentryFilter(httpAdapter));
  }
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // app.useGlobalFilters(new HttpExceptionFilter());

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('What To Cook API')
      .setDescription('API description for What To Cook application.')
      .setVersion('2.0')
      .addBearerAuth()
      .addOAuth2()
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, customOptions);
  }

  await app.listen(80);
}
bootstrap();
