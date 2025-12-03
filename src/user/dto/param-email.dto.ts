import { IsEmail, IsString } from 'class-validator';

export class EmailParamDto {
  @IsEmail()
  @IsString()
  email: string;
}
