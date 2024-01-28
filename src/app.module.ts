import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { EnvironmentModule } from './config/environment.module';
import { PrismaService } from './infrastructure/database/prisma.service';
import { HeartModule } from './heart.module';

@Module({
  imports: [EnvironmentModule, MemberModule, HeartModule],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule {}
