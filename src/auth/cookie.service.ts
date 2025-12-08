import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}
  private get prod() {
    return this.configService.get<string>('NODE_ENV') == 'production';
  }

  setRefreshToken(res: Response, refreshToken: string) {
    const refreshExp = this.configService.get<string>('REFRESH_EXP');
    const time = ms(refreshExp);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: time,
      secure: this.prod,
    });
  }

  cleanRefreshToken(res: Response) {
    res.cookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.prod,
      maxAge: 0,
    });
  }
}
