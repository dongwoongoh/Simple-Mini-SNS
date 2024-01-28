import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(PrismaService);
  await app.listen(3000);
}
bootstrap();
