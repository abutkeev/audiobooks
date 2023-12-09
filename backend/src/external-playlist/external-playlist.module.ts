import { Module } from '@nestjs/common';
import { ExternalPlaylistService } from './external-playlist.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ExternalPlaylistService],
  exports: [ExternalPlaylistService],
})
export class ExternalPlaylistModule {}
