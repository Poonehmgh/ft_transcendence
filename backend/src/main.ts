import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.use(cookieParser());
  // app.enableCors({origin:"*", credentials: true});
  app.enableCors({origin:"http://localhost:3000", credentials: true});
  app.enableCors({origin:"*", credentials: true});
  await app.listen(5500, '0.0.0.0', () => {
    console.log('NestJS application is listening on port 5500');
  });
}

bootstrap();

// localhost change