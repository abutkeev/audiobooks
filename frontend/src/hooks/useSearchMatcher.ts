import { useCallback } from 'react';
import useSearch from './useSearch';
import isMatch from '@/utils/isMatch';

interface SearchMatcherOptions {
  equels?: boolean;
}

const useSearchMatcher = () => {
  const searchString = useSearch() || '';

  const searchMatcher = useCallback(
    (value?: string, options?: SearchMatcherOptions) => {
      if (!value) return false;

      const { equels } = options || {};
      if (equels) return searchString === value;

      return isMatch({ searchString, value });
    },
    [searchString]
  );

  if (!searchString) return undefined;

  return searchMatcher;
};

export default useSearchMatcher;
