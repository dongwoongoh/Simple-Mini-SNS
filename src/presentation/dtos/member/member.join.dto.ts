import { ToBoolean } from '@/common/config/transform.config';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class MemberJoinDto {
    @IsEmail()
    @ApiProperty()
    public email: string;

    @IsString()
    @MinLength(8)
    @Matches(/(?=.*[!@#$%^&*])/, {
        message: 'password must contain at least one special character',
    })
    @ApiProperty()
    public password: string;

    @ToBoolean()
    @ApiProperty()
    public isAdmin: boolean;
}
