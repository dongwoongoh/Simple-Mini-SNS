import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { EnvironmentModule } from './config/environment.module';

@Module({
  imports: [EnvironmentModule, MemberModule],
  controllers: [],
})
export class AppModule {}
