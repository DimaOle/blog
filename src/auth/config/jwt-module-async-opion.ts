import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOption = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.getOrThrow<string>('SECRET_KEY'),
  signOptions: {
    expiresIn: configService.getOrThrow<string>('JWT_EXP'),
  },
});

export const options = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => jwtModuleOption(configService),
});
