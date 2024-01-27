import { Injectable, Scope } from '@nestjs/common';
import { MemberRepositoryInterface } from './member.repository.interface';
import { Member } from '../../entities/member';
import { PrismaClient } from '@prisma/client';
import { CREATION_FAILED } from '../../../common/contants/failed';

@Injectable({ scope: Scope.DEFAULT })
export class MemberRepository implements MemberRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  public async createUser(email: string, password: string, isAdmin: boolean) {
    try {
      const member = await this.prisma.$transaction(async (tx) => {
        return await tx.members.create({ data: { email, password, isAdmin } });
      });
      if (!member) throw new Error(CREATION_FAILED);
      return new Member(
        member.id,
        member.email,
        member.password,
        member.isAdmin,
      );
    } catch (error) {
      throw error;
    }
  }
  findUserByEmail: (email: string) => Promise<Member>;
}
