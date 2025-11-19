import { SetMetadata } from '@nestjs/common';

export const PUBLICK_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLICK_KEY, true);
