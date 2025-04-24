import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty({ message: "Can't be empty" })
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain at least 1 uppercase letter' })
  password: string;
}
