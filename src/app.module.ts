import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { EnvironmentModule } from './config/environment.module';
import { PrismaService } from './infrastructure/database/prisma.service';

@Module({
  imports: [EnvironmentModule, MemberModule],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule {}
