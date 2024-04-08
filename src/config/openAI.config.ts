import { registerAs } from '@nestjs/config';

export default registerAs('openAI', () => ({
  key: process.env.OPENAI_API_KEY,
}));
