import { SetMetadata } from '@nestjs/common';

//change it to secret key
export const IS_BYPASS_KEY = 'canBypass';
export const BypassEmailVerification = () => SetMetadata(IS_BYPASS_KEY, true);
