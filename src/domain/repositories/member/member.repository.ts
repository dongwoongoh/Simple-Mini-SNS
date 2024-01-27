import { Injectable, Scope } from '@nestjs/common';
import { MemberRepositoryInterface } from './member.repository.interface';
import { Member } from '../../entities/member';
import { PrismaClient } from '@prisma/client';
import { CREATION_FAILED } from '../../../common/contants/failed';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EMAIL_ALREADY_EXIST } from '../../../common/contants/already_exist';

@Injectable({ scope: Scope.DEFAULT })
export class MemberRepository implements MemberRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  public async createUser(email: string, password: string, isAdmin: boolean) {
    try {
      const transaction = await this.prisma.$transaction(async (tx) => {
        return await tx.members.create({ data: { email, password, isAdmin } });
      });

      if (!transaction) throw new Error(CREATION_FAILED);

      return new Member(
        transaction.id,
        transaction.email,
        transaction.password,
        transaction.isAdmin,
      );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new PrismaClientKnownRequestError(EMAIL_ALREADY_EXIST, {
          code: 'P2002',
          clientVersion: '0.01',
        });
      }

      throw error;
    }
  }

  public async findUserByEmail(email: string): Promise<Member | null> {
    const member = await this.prisma.members.findUnique({
      where: { email },
    });

    if (!member) {
      return null;
    }

    return new Member(member.id, member.email, member.password, member.isAdmin);
  }
}
