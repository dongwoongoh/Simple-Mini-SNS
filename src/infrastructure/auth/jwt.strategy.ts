import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { MemberRepository } from '@/domain/repositories/member/member.repository';
import { Member } from '@/domain/entities/member';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberRepository: MemberRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { email: string }): Promise<Member> {
    const email = payload.email;
    const member = await this.memberRepository.findUserByEmail(email);
    if (!member) throw new Error('Invalid token');
    const { fields } = member;
    return new Member(fields.id, fields.email, fields.password, fields.isAdmin);
  }
}
