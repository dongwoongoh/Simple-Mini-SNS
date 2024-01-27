import { Inject, Injectable, Scope } from '@nestjs/common';
import { EMAIL_ALREADY_EXIST } from 'src/common/contants/already_exist';
import { Member } from 'src/domain/entities/member';
import { MemberServiceInterface } from './member.service.interface';
import { MemberRepositoryInterface } from 'src/domain/repositories/member/member.repository.interface';

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
