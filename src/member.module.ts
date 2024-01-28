import { Module } from '@nestjs/common';
import { MemberRepository } from './domain/repositories/member/member.repository';
import { PrismaClient } from '@prisma/client';
import { MemberService } from './domain/services/member/member.service';
import { MemberHandler } from './presentation/handler/member.handler';

@Module({
    controllers: [MemberHandler],
    providers: [
        {
            provide: 'MEMBER_REPOSITORY',
            useClass: MemberRepository,
        },
        {
            provide: 'MEMBER_SERVICE',
            useClass: MemberService,
        },
        PrismaClient,
    ],
    exports: [
        {
            provide: 'MEMBER_REPOSITORY',
            useClass: MemberRepository,
        },
    ],
})
export class MemberModule {}
