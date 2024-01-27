import { Injectable, Scope } from '@nestjs/common';
import { AuthServiceInterface } from './auth.service.interface';
import { JwtService } from '@nestjs/jwt';
import { MemberRepository } from '@/domain/repositories/member/member.repository';
import { Member } from '@/domain/entities/member';

interface Payload {
  readonly email: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async login(email: string, password: string) {
    const member = await this.memberRepository.findUserByEmail(email);
    if (member && password === member.fields.password) {
      const payload: Payload = { email };
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      ]);
      const { fields } = member;
      return {
        member: new Member(
          fields.id,
          fields.email,
          fields.password,
          fields.isAdmin,
        ),
        access_token,
        refresh_token,
      };
    }
    return null;
  }
}
