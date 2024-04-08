import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));
