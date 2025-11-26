import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInDto, RegisterLocalUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '@prisma/client';
import { CreatedUser } from 'src/prisma/types';
@Injectable()
export class AuthService {
  constructor(readonly prisma: PrismaService, private jwtService: JwtService) {}
  async loginLocal(dto: RegisterLocalUserDto): Promise<CreatedUser> {
    const findUser = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (findUser) {
      throw new BadRequestException('try another email');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const craeteUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        provider: 'LOCAL',
        role: ['USER'],
        updateAt: new Date(),
      },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
    });

    if (!craeteUser) {
      throw new InternalServerErrorException('Database error');
    }

    return craeteUser;
  }

  async logInLocal(dto: LoginInDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordIsMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.createJwtToken(dto.email, user.password);
  }

  private async createJwtToken(email: string, password: string): Promise<{ access_token: string }> {
    const payload = { user: email, pas: password };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }
}
