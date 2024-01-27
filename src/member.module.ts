import { Module } from '@nestjs/common';
import { MemberRepository } from './domain/repositories/member/member.repository';
import { MemberService } from './domain/services/member/member.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'MEMBER_REPOSITROY',
      useClass: MemberRepository,
    },
    {
      provide: 'MEMBER_SERVICE',
      useClass: MemberService,
    },
    PrismaClient,
  ],
})
export class MemberModule {}
