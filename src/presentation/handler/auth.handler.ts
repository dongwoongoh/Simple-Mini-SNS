import { AuthService } from '@/infrastructure/auth/auth.service';
import {
    Body,
    Controller,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Res,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthSignInDto } from '../dtos/auth/auth.sign.in.dto';
import { NOT_EXIST_MEMBER } from '@/common/constants/exist';
import { NOT_MATHCED_PASSWORD } from '@/common/constants/match';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(@Inject(AuthService) private readonly service: AuthService) {}

    @Post()
    @ApiOperation({ summary: 'sign in a member' })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiBody({ type: AuthSignInDto })
    private async signIn(
        @Body() { email, password }: AuthSignInDto,
        @Res() res: Response,
    ) {
        try {
            const { member, access_token } = await this.service.signIn(
                email,
                password,
            );
            res.setHeader('Authorization', access_token);
            res.cookie('token', access_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1000,
            });
            return res.send(member);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === NOT_EXIST_MEMBER)
                    throw new NotFoundException('email');
                if (error.message === NOT_MATHCED_PASSWORD)
                    throw new UnprocessableEntityException('password');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
