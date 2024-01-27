import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Member } from '@/domain/entities/member';
import { MemberDecorator } from './member.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@MemberDecorator() member: Member) {
    return member.fields;
  }
}
