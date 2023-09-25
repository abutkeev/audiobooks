import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export const IS_ADMIN_KEY = 'isAdmin';
export const Admin = () => applyDecorators(SetMetadata(IS_ADMIN_KEY, true), ApiSecurity({ bearerAuth: ['admin'] }));
