import { SetMetadata } from '@nestjs/common';

export const INACTIVE_ALLOWED_KEY = 'inactiveAllowed';
export const AllowInactive = () => SetMetadata(INACTIVE_ALLOWED_KEY, true);
