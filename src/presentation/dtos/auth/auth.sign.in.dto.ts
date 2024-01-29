import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class AuthSignInDto {
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
}
