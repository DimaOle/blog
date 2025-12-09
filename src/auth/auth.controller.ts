import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/libs/common/src/decorators';
import { LoginInDto, RefreshTokenDto, RegisterLocalUserDto } from './dto';
import { Response } from 'express';
import { CookieService } from './cookie.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  registerLocal(@Body() dto: RegisterLocalUserDto) {
    return this.authService.registerLocal(dto);
  }

  @Post('login-local')
  @Public()
  loginLocal(
    @Body() dto: LoginInDto,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logInLocal(dto, userAgent, res);
  }

  @Post('refresh-token')
  refreshToken(
    @Body() dto: RefreshTokenDto,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(res, userAgent, dto.userId);
  }
}
