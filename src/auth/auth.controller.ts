import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/libs/common/src/decorators';
import { RegisterLocalUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  loginLocal(@Body() dto: RegisterLocalUserDto) {
    return this.authService.loginLocal(dto);
  }
}
