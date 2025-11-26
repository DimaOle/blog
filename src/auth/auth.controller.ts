import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/libs/common/src/decorators';
import { RegisterLocalUserDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  loginLocal(
    @Body() dto: RegisterLocalUserDto,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(userAgent);
    // console.log(res);
    return this.authService.loginLocal(dto);
  }
}
