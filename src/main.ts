import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './libs/common/src/pipes';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new CustomValidationPipe());
  app.use(cookieParser());
  await app.listen(PORT);

  console.log(`server started in PORT:${PORT}`);
}

bootstrap();
