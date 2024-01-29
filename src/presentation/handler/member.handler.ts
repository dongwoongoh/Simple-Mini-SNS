import { MemberServiceInterface } from '@/domain/services/member/member.service.interface';
import {
    Body,
    ConflictException,
    Controller,
    Inject,
    InternalServerErrorException,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberJoinDto } from '../dtos/member/member.join.dto';
import { EXIST_EMAIL } from '@/common/constants/exist';
import { MemberJoinInterceptor } from '../interceptor/member.join.interceptor';

@Controller('members')
@ApiTags('Members')
export class MemberHandler {
    constructor(
        @Inject('MEMBER_SERVICE')
        private readonly service: MemberServiceInterface,
    ) {}
    @Post()
    @UseInterceptors(new MemberJoinInterceptor())
    @ApiOperation({ summary: 'create a new member' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({ type: MemberJoinDto })
    private async join(@Body() { email, password, isAdmin }: MemberJoinDto) {
        try {
            return await this.service.join(email, password, isAdmin);
        } catch (error) {
            if (error instanceof Error && error.message === EXIST_EMAIL) {
                throw new ConflictException('email');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
