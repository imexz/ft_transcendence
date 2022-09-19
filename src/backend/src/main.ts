import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { hostURL } from './hostURL';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: hostURL + ":8080", credentials: true});
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
