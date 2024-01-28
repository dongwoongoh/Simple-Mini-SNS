import { Inject, Injectable, Scope } from '@nestjs/common';
import { MemberRepositoryInterface } from './member.repository.interface';
import { Prisma, PrismaClient } from '@prisma/client';
import { Member } from '@/domain/entities/member';
import { EXIST_EMAIL, NOT_EXIST_MEMBER } from '@/common/constants/exist';
import { UNEXCEPTION_ERROR } from '@/common/constants/unexception';

@Injectable({ scope: Scope.DEFAULT })
export class MemberRepository implements MemberRepositoryInterface {
    constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

    public async create(email: string, password: string, isAdmin: boolean) {
        try {
            const { id } = await this.prisma.$transaction(
                async (tx) =>
                    await tx.members.create({
                        data: { email, password, isAdmin },
                    }),
            );
            return new Member(id, email, isAdmin);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw Error(EXIST_EMAIL);
            } else {
                throw new Error(UNEXCEPTION_ERROR);
            }
        }
    }
    public async find(email: string) {
        try {
            const member = await this.prisma.members.findUnique({
                where: { email },
            });
            if (!member)
                throw new Prisma.PrismaClientKnownRequestError(
                    NOT_EXIST_MEMBER,
                    {
                        code: 'P2001',
                        clientVersion: '0.0.1',
                    },
                );
            return new Member(member.id, member.email, member.isAdmin);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2001'
            ) {
                throw new Error(NOT_EXIST_MEMBER);
            } else {
                throw new Error(UNEXCEPTION_ERROR);
            }
        }
    }
}
