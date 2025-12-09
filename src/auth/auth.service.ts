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
import { CreatedUser } from 'src/prisma/types';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { PayloadRefreshToken } from './interfaces';
import { UserService } from 'src/user/user.service';
import { CookieService } from './cookie.service';
import { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private configServise: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private cookieService: CookieService,
  ) {}
  async registerLocal(dto: RegisterLocalUserDto): Promise<CreatedUser> {
    const findUser = await this.userService.getUserByEmail(dto.email);

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

  async logInLocal(dto: LoginInDto, userAgent: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordIsMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.createRefreshToken(user.id, userAgent, res);
    return this.createJwtToken(dto.email, user.password);
  }

  async refreshToken(
    res: Response,
    userAgent: string,
    userId: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.prisma.token.findUnique({
        where: { userId_userAgent: { userId, userAgent } },
        include: {
          user: {
            select: {
              email: true,
              password: true,
            },
          },
        },
      });
      if (!user) {
        throw new UnauthorizedException('refreToken expired');
      }

      if (new Date() > user.exp) {
        throw new UnauthorizedException('refreToken expired');
      }

      await this.createRefreshToken(userId, userAgent, res);

      return this.createJwtToken(user.user.email, user.user.password);
    } catch (e) {
      console.log(`Prisma: ${e}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  private async createJwtToken(email: string, password: string): Promise<{ access_token: string }> {
    const payload = { user: email, pas: password };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: `Bearer ${token}`,
    };
  }

  private async createRefreshToken(
    userId: string,
    userAgent: string,
    res: Response,
  ): Promise<PayloadRefreshToken> {
    const uuidV4 = uuidv4();
    const refreshExp = this.configServise.get<string>('REFRESH_EXP');
    const expDate = new Date(Date.now() + ms(refreshExp));

    const refreshToken = await this.prisma.token.upsert({
      where: {
        userId_userAgent: { userId, userAgent },
      },
      update: {
        token: uuidV4,
        exp: expDate,
      },
      create: {
        token: uuidV4,
        exp: expDate,
        userAgent,
        userId,
      },
      select: {
        token: true,
        exp: true,
      },
    });

    this.cookieService.setRefreshToken(res, refreshToken.token);
    return refreshToken;
  }
}
