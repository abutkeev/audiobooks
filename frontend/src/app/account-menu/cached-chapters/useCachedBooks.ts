import { useMemo } from 'react';
import { useBooksGetQuery } from '@/api/api';
import useAuthors from '@/hooks/useAuthors';
import useMediaCache from '@/hooks/useMediaCache';

export interface CachedBook {
  id: string;
  name: string;
  author: string;
  urls: string[];
  size: number;
}

// chapter urls look like /api/books/<book id>/<chapter file>
const getBookId = (url: string) => {
  try {
    const segments = new URL(url).pathname.split('/');
    return segments[segments.length - 2] || '';
  } catch {
    return '';
  }
};

const useCachedBooks = () => {
  const { entries, available } = useMediaCache();
  const { data: books = [], isLoading: booksLoading, isError: booksError } = useBooksGetQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();

  const cachedBooks = useMemo(() => {
    const grouped = new Map<string, { urls: string[]; size: number }>();
    for (const [url, entry] of Object.entries(entries)) {
      if (entry.state !== 'cached') continue;
      const id = getBookId(url);
      if (!id) continue;
      const { urls, size } = grouped.get(id) || { urls: [], size: 0 };
      grouped.set(id, { urls: [...urls, url], size: size + (entry.size || 0) });
    }

    return [...grouped]
      .map(([id, { urls, size }]): CachedBook => {
        const { info } = books.find(({ id: bookId }) => bookId === id) || {};
        return {
          id,
          name: info?.name || id,
          author: info?.authors.map(authorId => authors[authorId]).join(', ') || '',
          urls,
          size,
        };
      })
      .sort(({ name: a }, { name: b }) => a.localeCompare(b));
  }, [entries, books, authors]);

  return {
    cachedBooks,
    available,
    loading: booksLoading || authorsLoading,
    error: booksError || authorsError,
  };
};

export default useCachedBooks;
