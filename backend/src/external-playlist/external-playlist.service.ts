import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import ExternalChapterDto from 'src/books/dto/ExternalChapterDto';

@Injectable()
export class ExternalPlaylistService {
  constructor(private readonly httpService: HttpService) {}

  private async extractPlayerJsRawPlaylist(data: string, bookUrl: string) {
    // https://otrub.in/
    const internalResult = /["']?file["']?:\s*(\[[^\]]+\])/.exec(data);
    if (internalResult && internalResult.length === 2) {
      return internalResult[1];
    }

    const stringResult = /file:"([^"]+)"/.exec(data);
    if (!stringResult || stringResult.length !== 2) return;
    try {
      const url = new URL(stringResult[1]).toString();
      const { origin } = new URL(bookUrl);
      const { data } = await firstValueFrom(
        this.httpService.get(url.toString(), {
          responseType: 'text',
          // https://booksrelax.com
          headers: {
            Origin: origin,
            Referer: origin,
          },
        })
      );
      return data;
    } catch (e) {
      // ignore error
    }
  }

  private async getPlayerJsPlaylist(data: string, bookUrl: string) {
    try {
      const rawPlaylist = await this.extractPlayerJsRawPlaylist(data, bookUrl);
      if (!rawPlaylist) return;

      const playlist = JSON.parse(rawPlaylist);
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
      return playlist.map(({ title, file }) => {
        // https://uknig.com
        const url = file.split(' or ')[0];
        return { title, url, bookUrl };
      });
    } catch {}
  }

  // https://audioknigivse.ru
  // https://slushkinvsem.ru/
  getDlePlaylist(data: string, bookUrl: string) {
    const result = /<!--dle_audio_begin:([^>]+)-->/.exec(data);
    if (!result || result.length !== 2) return;

    const playlist: ExternalChapterDto[] = [];
    for (const rawChapter of result[1].split(',')) {
      const chapter = rawChapter.split('|');
      if (chapter.length !== 2) return;
      try {
        playlist.push({ title: chapter[1], url: new URL(chapter[0]).toString(), bookUrl });
      } catch {
        // ignore errors
      }
    }

    return playlist;
  }

  // https://yakniga.org/
  getGraphQlStatePlaylist(data: string, bookUrl: string) {
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
          playlist.push({ url, title: value.name, bookUrl });
        } catch {
          return;
        }
      }
    }
    return playlist;
  }

  async getPlaylist(data: string, url: string): Promise<ExternalChapterDto[] | undefined> {
    const playerJsPlaylist = await this.getPlayerJsPlaylist(data, url);
    if (playerJsPlaylist && playerJsPlaylist.length > 0) {
      return playerJsPlaylist;
    }

    const dlePlaylist = this.getDlePlaylist(data, url);
    if (dlePlaylist && dlePlaylist.length > 0) {
      return dlePlaylist;
    }

    const graphQlStatePlaylist = this.getGraphQlStatePlaylist(data, url);
    if (graphQlStatePlaylist && graphQlStatePlaylist.length > 0) {
      return graphQlStatePlaylist;
    }
  }
}
