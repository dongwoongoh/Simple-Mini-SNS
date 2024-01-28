import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginMemberDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'password must contain at least one special character',
  })
  public password: string;
}
