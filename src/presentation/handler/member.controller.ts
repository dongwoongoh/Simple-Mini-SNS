import { MemberServiceInterface } from '@/domain/services/member/member.service.interface';
import {
  Body,
  ConflictException,
  Controller,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateMemberDto } from '../dtos/create.member.dto';
import { EMAIL_ALREADY_EXIST } from '@/common/contants/already_exist';
import { MemberInterceptor } from '@/infrastructure/interceptors/member.interceptor';
import { LoginMemberDto } from '../dtos/login.member.dto';
import { NOT_FOUND_MEMBER } from '@/common/contants/not_found';

@Controller('members')
@UseInterceptors(new MemberInterceptor())
export class MemberController {
  constructor(
    @Inject('MEMBER_SERVICE') private readonly service: MemberServiceInterface,
  ) {}

  @Post()
  public async createMember(
    @Body() { email, password, isAdmin }: CreateMemberDto,
  ) {
    try {
      const member = await this.service.createMember(email, password, isAdmin);
      return member.fields;
    } catch (error) {
      if (error instanceof Error && error.message === EMAIL_ALREADY_EXIST) {
        throw new ConflictException('email');
      } else if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Post('login')
  public async login(@Body() { email, password }: LoginMemberDto) {
    try {
      const member = await this.service.login(email, password);
      return member.fields;
    } catch (error) {
      if (error instanceof Error && error.message === NOT_FOUND_MEMBER) {
        throw new NotFoundException('member');
      } else if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
