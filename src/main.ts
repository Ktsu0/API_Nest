import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 2. 💡 Adicionar o middleware cookieParser
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      // Permite localhost e subdomínios da vercel.app
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Deixa passar tudo para evitar bloqueios extras por enquanto
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
