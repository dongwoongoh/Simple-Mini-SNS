import {
  IsEmail,
  IsBoolean,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateMemberDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'password must contain at least one special character',
  })
  public password: string;

  @IsBoolean()
  public isAdmin: boolean;
}
