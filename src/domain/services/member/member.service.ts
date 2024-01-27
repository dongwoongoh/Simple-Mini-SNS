import { Inject, Injectable, Scope } from '@nestjs/common';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';
import { MemberServiceInterface } from './member.service.interface';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { Member } from '@/domain/entities/member';

@Injectable({ scope: Scope.DEFAULT })
export class MemberService implements MemberServiceInterface {
  constructor(
    @Inject('MEMBER_REPOSITROY')
    private memberRepository: MemberRepositoryInterface,
  ) {}

  public async createMember(
    email: string,
    password: string,
    isAdmin: boolean,
  ): Promise<Member> {
    try {
      const existingMember = await this.memberRepository.findUserByEmail(email);
      if (existingMember) throw new Error(EMAIL_ALREADY_EXIST);

      const newMember = await this.memberRepository.createUser(
        email,
        password,
        isAdmin,
      );

      const { fields } = newMember;

      return new Member(
        fields.id,
        fields.email,
        fields.password,
        fields.isAdmin,
      );
    } catch (error) {
      throw error;
    }
  }
}
