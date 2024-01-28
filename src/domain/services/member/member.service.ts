import { Inject, Injectable, Scope } from '@nestjs/common';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';
import { MemberServiceInterface } from './member.service.interface';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { Member } from '@/domain/entities/member';
import { NOT_FOUND_MEMBER } from '@/common/contants/not_found';

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

  async login(email: string, password: string): Promise<Member> {
    const member = await this.memberRepository.findUserByEmail(email);

    if (member) {
      const { fields } = member;
      if (fields.password === password) {
        return new Member(
          fields.id,
          fields.email,
          fields.password,
          fields.isAdmin,
        );
      }
    }

    throw Error(NOT_FOUND_MEMBER);
  }
}
