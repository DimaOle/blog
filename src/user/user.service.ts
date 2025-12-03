import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatedUser } from 'src/prisma/types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<CreatedUser | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
      });
      return user;
    } catch (e) {
      console.log(`Prisma: ${e}`);
      throw new InternalServerErrorException('Database error');
    }
  }
}
