import { useCallback } from 'react';
import useSearch from './useSearch';

interface SearchMatcherOptions {
  equels?: boolean;
}

const useSearchMatcher = () => {
  const search = useSearch() || '';

  const searchMatcher = useCallback(
    (searchSource: string, options?: SearchMatcherOptions) => {
      const { equels } = options || {};
      if (equels) return search === searchSource;

      const lowerSearch = search.toLocaleLowerCase();
      return searchSource.toLocaleLowerCase().includes(lowerSearch);
    },
    [search]
  );

  if (!search) return undefined;

  return searchMatcher;
};

export default useSearchMatcher;
