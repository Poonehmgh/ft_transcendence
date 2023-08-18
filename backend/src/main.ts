import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import {PrismaClient} from "@prisma/client"
//
// const prisma = new PrismaClient();
// to: check prisma connection

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5500);
}
bootstrap();
