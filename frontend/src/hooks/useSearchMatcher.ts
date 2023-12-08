import { useCallback } from 'react';
import useSearch from './useSearch';
import { convert_en2ru } from '@/utils/convert-layout';

interface SearchMatcherOptions {
  equels?: boolean;
}

const useSearchMatcher = () => {
  const search = useSearch() || '';

  const searchMatcher = useCallback(
    (searchSource?: string, options?: SearchMatcherOptions) => {
      if (!searchSource) return false;

      const { equels } = options || {};
      if (equels) return search === searchSource;

      const lowerSearchSource = searchSource.toLocaleLowerCase();
      const lowerSearch = search.toLocaleLowerCase();
      const search2ruPc = convert_en2ru(search, 'pc');
      const search2ruMac = convert_en2ru(search, 'mac');
      return (
        lowerSearchSource.includes(lowerSearch) ||
        lowerSearchSource.includes(search2ruPc) ||
        lowerSearchSource.includes(search2ruMac)
      );
    },
    [search]
  );

  if (!search) return undefined;

  return searchMatcher;
};

export default useSearchMatcher;
