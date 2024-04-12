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

async function bootstrap() {
  console.log('NODE_ENV:', process.env.NODE);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('SENTRY_DSN:', process.env.SENTRY_DSN);

  if (process.env.NODE === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      debug: true,
    });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE !== 'production') {
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

  if (process.env.NODE === 'production') {
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new SentryFilter(httpAdapter));
  }

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (process.env.NODE !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('What To Cook API')
      .setDescription('API description for What To Cook application.')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, customOptions);
  }

  await app.listen(3000);
}
bootstrap();
