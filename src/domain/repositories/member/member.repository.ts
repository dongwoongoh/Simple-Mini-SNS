import { Inject, Injectable, Scope } from '@nestjs/common';
import { MemberRepositoryInterface } from './member.repository.interface';
import { PrismaClient } from '@prisma/client';
import { CREATION_FAILED } from '@/common/contants/failed';
import { Member } from '@/domain/entities/member';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';

@Injectable({ scope: Scope.DEFAULT })
export class MemberRepository implements MemberRepositoryInterface {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

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
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(EMAIL_ALREADY_EXIST);
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
