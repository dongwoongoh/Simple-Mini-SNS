import { MemberServiceInterface } from '@/domain/services/member/member.service.interface';
import {
  Body,
  ConflictException,
  Controller,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateMemberDto } from '../dtos/create.member.dto';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';
import { MemberInterceptor } from '@/infrastructure/interceptors/member.interceptor';

@Controller('members')
@UseInterceptors(MemberInterceptor)
export class MemberController {
  constructor(
    @Inject('MEMBER_SERVICE') private readonly service: MemberServiceInterface,
  ) {}

  @Post()
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    const { email, password, isAdmin } = createMemberDto;
    try {
      const member = await this.service.createMember(email, password, isAdmin);
      return member.fields;
    } catch (error) {
      if (error instanceof Error && error.message === EMAIL_ALREADY_EXIST) {
        throw new ConflictException('email');
      }
    }
  }
}
