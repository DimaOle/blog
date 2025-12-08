import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { options } from './config';
import { UserModule } from 'src/user/user.module';
import { CookieService } from './cookie.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CookieService],
  imports: [PrismaModule, UserModule, JwtModule.registerAsync(options())],
})
export class AuthModule {}
