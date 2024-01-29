import { HeartRepository } from '@/domain/repositories/heart/heart.repository';
import { HeartService } from '@/domain/services/heart/heart.service';
import { HeartController } from '@/presentation/handler/heart.handler';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Module({
    controllers: [HeartController],
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
        JwtService,
    ],
})
export class HeartModule {}
