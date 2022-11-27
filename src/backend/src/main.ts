import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';
import { hostURL } from './hostURL';
import { ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from './timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: hostURL + ":8080", credentials: true});
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.useGlobalInterceptors(new TimeoutInterceptor)
  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('ft_transcendence')
  .setDescription('The ft_transcendence API description')
  .setVersion('1.0')
  .addTag('ft_transcendence')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
