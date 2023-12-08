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

  // https://yakniga.org/
  graphQlStatePlaylist(data: string, bookUrl: string) {
    const stateExpression = /<script>window.__NUXT__=(\([^<]+\));<\/script>/.exec(data);
    if (!stateExpression || stateExpression.length !== 2) return;

    const state: unknown = eval(stateExpression[1]);
    if (
      !state ||
      typeof state !== 'object' ||
      !('apollo' in state) ||
      !state.apollo ||
      typeof state.apollo !== 'object' ||
      !('defaultClient' in state.apollo) ||
      !state.apollo.defaultClient ||
      typeof state.apollo.defaultClient !== 'object'
    ) {
      return;
    }
    const playlist: ExternalChapterDto[] = [];
    for (const [name, value] of Object.entries(state.apollo.defaultClient as [string, unknown])) {
      if (name.startsWith('Chapter:')) {
        if (
          !value ||
          typeof value !== 'object' ||
          !('name' in value) ||
          typeof value.name !== 'string' ||
          !('fileUrl' in value) ||
          typeof value.fileUrl !== 'string'
        ) {
          return;
        }
        try {
          const url = new URL(value.fileUrl, bookUrl).toString();
          playlist.push({ url, title: value.name });
        } catch {
          return;
        }
      }
    }
    return playlist;
  }

  getPlaylist(data: string, url: string): ExternalChapterDto[] | undefined {
    const playerJsPlaylist = this.getPlayerJsPlaylist(data);
    if (playerJsPlaylist) {
      return playerJsPlaylist;
    }

    const graphQlStatePlaylist = this.graphQlStatePlaylist(data, url);
    if (graphQlStatePlaylist) {
      return graphQlStatePlaylist;
    }
  }
}
