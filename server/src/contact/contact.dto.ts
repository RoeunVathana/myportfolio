import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;
}
