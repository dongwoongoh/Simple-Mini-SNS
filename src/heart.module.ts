import { Module } from '@nestjs/common';
import { HeartRepository } from './domain/repositories/heart/heart.repository';
import { HeartService } from './domain/services/heart/heart.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    {
      provide: 'HEART_REPOSITORY',
      useClass: HeartRepository,
    },
    {
      provide: 'HEART_SERVICE',
      useClass: HeartService,
    },
    PrismaClient,
  ],
})
export class HeartModule {}
