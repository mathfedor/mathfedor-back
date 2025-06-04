import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL,// O usa una array si necesitas varios
    credentials: true,               // Si estás usando cookies o headers personalizados
  });

  await app.listen(process.env.PORT || 5000);
}
bootstrap(); 