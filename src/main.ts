import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './libs/common/src/pipes';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(PORT);

  console.log(`server started in PORT:${PORT}`);
}

bootstrap();
