import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuthModule } from '../../infrastructure/auth/auth.module';
import { HeartModule } from './heart.module';

@Module({
    imports: [MemberModule, AuthModule, HeartModule],
    providers: [PrismaService],
    controllers: [],
})
export class AppModule {}
