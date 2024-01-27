import { Module } from '@nestjs/common';
import { MemberModule } from './member.module';
import { MemberRepository } from './domain/repositories/member/member.repository';

@Module({
  imports: [MemberModule],
  controllers: [],
})
export class AppModule {}
