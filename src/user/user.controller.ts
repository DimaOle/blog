import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailParamDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @Get(':email')
  findUserByEmail(@Param() value: EmailParamDto) {
    return this.userSevice.getUserByEmail(value.email);
  }
}
