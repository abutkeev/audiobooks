import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const HAS_ONLINE_TAG = 'hasOnlineTag';
export const HasOnlineTag = () => applyDecorators(SetMetadata(HAS_ONLINE_TAG, true), ApiTags('online'));
