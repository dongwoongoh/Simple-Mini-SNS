import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
    imports: [MemberModule],
    providers: [PrismaService],
    controllers: [],
})
export class AppModule {}
