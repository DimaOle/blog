import { Controller, Get, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailParamDto } from './dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @Get('all')
  findAll(@Res({ passthrough: true }) res: Response) {
    console.log(res.cookie);
  }

  @Get(':email')
  findUserByEmail(@Param() value: EmailParamDto) {
    return this.userSevice.getUserByEmail(value.email);
  }
}
