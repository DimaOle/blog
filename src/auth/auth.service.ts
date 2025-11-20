import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterLocalUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(readonly prisma: PrismaService) {}
  async loginLocal(dto: RegisterLocalUserDto) {
    const findUser = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (findUser) {
      throw new BadRequestException('try another email');
    }

    const craeteUser = await this.prisma.user.create({
      data: { ...dto, provider: 'LOCAL', role: ['USER'], updateAt: new Date() },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
    });

    if (!craeteUser) {
      throw new InternalServerErrorException('Database error');
    }

    return craeteUser;
  }
}
