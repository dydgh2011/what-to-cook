import { SetMetadata } from '@nestjs/common';

//change it to secret key
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
