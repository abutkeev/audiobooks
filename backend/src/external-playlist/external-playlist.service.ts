import { Injectable } from '@nestjs/common';
import ExternalChapterDto from 'src/books/dto/ExternalChapterDto';

@Injectable()
export class ExternalPlaylistService {
  private getPlayerJsPlaylist(data: string) {
    try {
      const result = /file:(\[[^\]]+\])/.exec(data);
      if (!result) return;

      const playlist = JSON.parse(result[1]);
      if (!Array.isArray(playlist)) return;

      for (const item of playlist) {
        if (
          !item ||
          typeof item !== 'object' ||
          !(
            'title' in item &&
            'file' in item &&
            item.title &&
            item.file &&
            typeof item.title === 'string' &&
            typeof item.file === 'string'
          )
        ) {
          return;
        }
      }
      return playlist.map(({ title, file }) => ({ title, url: file }));
    } catch {}
  }

  getPlaylist(data: string): ExternalChapterDto[] | undefined {
    const playerJsPlaylist = this.getPlayerJsPlaylist(data);
    if (playerJsPlaylist) {
      return playerJsPlaylist;
    }
  }
}
