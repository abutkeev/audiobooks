import { Module } from '@nestjs/common';
import { ExternalPlaylistService } from './external-playlist.service';

@Module({
  providers: [ExternalPlaylistService],
  exports: [ExternalPlaylistService],
})
export class ExternalPlaylistModule {}
