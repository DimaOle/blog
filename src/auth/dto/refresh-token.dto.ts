import { IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsUUID()
  userId: string;
}
