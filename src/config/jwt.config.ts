import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET || 'super-secret-key',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRE_IN,
    },
  }),
);
