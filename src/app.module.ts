import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
    imports: [MemberModule, AuthModule],
    providers: [PrismaService],
    controllers: [],
})
export class AppModule {}
