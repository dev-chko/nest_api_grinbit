import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as morgan from 'morgan';
import { RedisIoAdapter } from './socket/redis.adapter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const enforce = require('express-sslify-port');

import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  Logger.log(`===> Start ${process.env.NODE_ENV} mode`);
  Logger.log(process.env.NODE_ENV, typeof process.env.NODE_ENV);
  Logger.log(`===> Dir ${__dirname}`);

  const keyPath =
    process.env.NODE_ENV === 'development'
      ? join(__dirname, '/../localhost.key')
      : '/etc/letsencrypt/live/cloudpc.grinbit.io/privkey.pem';
  const certPath =
    process.env.NODE_ENV === 'development'
      ? join(__dirname, '/../localhost.crt')
      : '/etc/letsencrypt/live/cloudpc.grinbit.io/fullchain.pem';

  // const keyPath = join(__dirname, '/../privkey.pem');
  // const certPath = join(__dirname, '/../fullchain.pem');

  ////////////////////////////////
  // http
  const httpApp = await NestFactory.create(AppModule, {
    logger: console,
  });
  httpApp.use(
    morgan(
      ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length]',
      {
        skip: (req, res) =>
          req.path === '/favicon.ico' || req.path.startsWith('/static/'),
      },
    ),
  );
  httpApp.use(
    enforce.HTTPS({
      port:
        process.env.NODE_ENV === 'production' ? 443 : process.env.HTTPS_PORT,
    }),
  );
  await httpApp.listen(process.env.HTTP_PORT || 8000);

  ////////////////////////////////
  // https
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  const httpsApp = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: console,
  });
  httpsApp.setGlobalPrefix('api/v1');
  httpsApp.useGlobalPipes(new ValidationPipe());
  httpsApp.use(
    morgan(
      ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length]',
      {
        skip: (req, res) =>
          req.path === '/favicon.ico' || req.path.startsWith('/static/'),
      },
    ),
  );

  // cors
  httpsApp.enableCors({
    origin: [
      'http://localhost:1212',
      'http://localhost:1213',
      'https://dev.grinbit.io:8880',
      'https://cloudpc.grinbit.io',
    ],
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
    // allowedHeaders:
    //   'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  // swagger
  if (
    process.env.NODE_ENV === 'staging' ||
    process.env.NODE_ENV === 'development'
  ) {
    const config = new DocumentBuilder()
      .setTitle('CloudPC API')
      .setDescription('CloudPC API DOC')
      .setVersion('0.0.1')
      .addBearerAuth(
        {
          name: 'access-token',
          description: 'Enter access-token',
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      .addBearerAuth(
        {
          name: 'refresh-token',
          description: 'Enter refresh-token',
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'refresh-token',
      )
      .build();

    const document = SwaggerModule.createDocument(httpsApp, config);
    SwaggerModule.setup('api/v1/', httpsApp, document, {
      swaggerOptions: {
        persistAuthorization: true,

        // for auto login in Swagger UI
        // 디버그 모드에서 스웨거에서 로그인후 .env에 토큰값을 설정후 사용한다.
        authAction: {
          'access-token': {
            name: 'access-token',
            schema: {
              description: 'Default access-token',
              type: 'http',
              in: 'header',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            value:
              process.env.NODE_ENV === 'development'
                ? process.env.SWAGGER_ACCESS_TOKEN
                : null,
          },
          'refresh-token': {
            name: 'refresh-token',
            schema: {
              description: 'Default refresh-token',
              type: 'http',
              in: 'header',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            value:
              process.env.NODE_ENV === 'development'
                ? process.env.SWAGGER_REFRESH_TOKEN
                : null,
          },
        },
      },
    });
  }

  // redis & websocket
  const redisIoAdapter = new RedisIoAdapter(httpsApp);
  await redisIoAdapter.connectToRedis();
  httpsApp.useWebSocketAdapter(redisIoAdapter);

  await httpsApp.listen(process.env.HTTPS_PORT || 8080);
}

bootstrap();
