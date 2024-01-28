import { Inject, Injectable, Scope } from '@nestjs/common';
import { MemberServiceInterface } from './member.service.interface';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';

@Injectable({ scope: Scope.DEFAULT })
export class MemberService implements MemberServiceInterface {
    constructor(
        @Inject('MEMBER_REPOSITORY')
        private readonly repository: MemberRepositoryInterface,
    ) {}

    public async join(email: string, password: string, isAdmin: boolean) {
        try {
            return await this.repository.create(email, password, isAdmin);
        } catch (error) {
            throw error;
        }
    }
}
