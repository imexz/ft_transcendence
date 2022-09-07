import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
<<<<<<< HEAD
  app.use(cookieParser());
=======
>>>>>>> 770c996e64e3df1f4dbe95e08d3c44f6f0ecc909
  await app.listen(3000);
}
bootstrap();
