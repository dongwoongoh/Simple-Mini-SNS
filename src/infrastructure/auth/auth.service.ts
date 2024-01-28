import { NOT_EXIST_MEMBER } from '@/common/constants/exist';
import { NOT_MATHCED_PASSWORD } from '@/common/constants/match';
import { MemberRepositoryInterface } from '@/domain/repositories/member/member.repository.interface';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
    constructor(
        @Inject('MEMBER_REPOSITORY')
        private readonly repository: MemberRepositoryInterface,
        private readonly jwtService: JwtService,
    ) {}

    public async signIn(email: string, password: string) {
        const member = await this.repository.find(email);
        if (member) {
            const match = await bcrypt.compare(password, member.data.password);
            if (match) {
                return {
                    access_token: await this.jwtService.signAsync({
                        id: member.data.id,
                        email: member.data.email,
                        isAdmin: member.data.isAdmin,
                    }),
                };
            } else {
                throw Error(NOT_MATHCED_PASSWORD);
            }
        } else {
            throw Error(NOT_EXIST_MEMBER);
        }
    }
}
