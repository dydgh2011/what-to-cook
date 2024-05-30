import { SetMetadata } from '@nestjs/common';

//indicates this route renders a page
export const IS_PAGE = 'isPage';
export const IsPage = () => SetMetadata(IS_PAGE, true);
