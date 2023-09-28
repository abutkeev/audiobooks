import { BooksGetApiResponse, BooksGetBookInfoApiResponse, api } from './api';

const enhancedApi = api.enhanceEndpoints({
  endpoints: {
    booksGet: {
      transformResponse(response: BooksGetApiResponse, meta) {
        if (!meta) return response;

        const {
          request: { url },
        } = meta;
        for (const book of response) {
          if (book.info.cover) {
            const bookUrl = new URL(`${book.id}/`, `${url}/`).toString();
            book.info.cover.filename = new URL(book.info.cover.filename, bookUrl).toString();
          }
        }

        return response;
      },
    },
    booksGetBookInfo: {
      transformResponse(response: BooksGetBookInfoApiResponse, meta) {
        if (!meta) return response;

        const {
          request: { url },
        } = meta;

        if (response.info.cover) {
          response.info.cover.filename = new URL(response.info.cover.filename, `${url}/`).toString();
        }

        for (const chapter of response.chapters) {
          chapter.filename = new URL(chapter.filename, `${url}/`).toString();
        }

        return response;
      },
    },
  },
});

export default enhancedApi;
