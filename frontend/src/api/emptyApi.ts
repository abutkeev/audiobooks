import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { store } from '../store';

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: headers => {
      const token = store.getState().auth.token;
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    responseHandler: async response => {
      const { url } = response;
      const json = await response.json();
      if (url.endsWith('info.json') && 'chapters' in json) {
        for (const chapter of json.chapters) {
          if ('filename' in chapter) {
            chapter.filename = new URL(chapter.filename, url).toString();
          }
        }
        if ('info' in json && 'cover' in json.info) {
          json.info.cover.filename = new URL(json.info.cover.filename, url).toString();
        }
      }
      if (url.endsWith('books.json') && Array.isArray(json)) {
        for (const book of json) {
          if ('info' in book && 'cover' in book.info) {
            const bookUrl = new URL(`books/${book.id}/`, url).toString();
            book.info.cover.filename = new URL(book.info.cover.filename, bookUrl).toString();
          }
        }
      }
      return json;
    },
  }),
  endpoints: () => ({}),
});
