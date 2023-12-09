import { useCallback } from 'react';
import useSearch from './useSearch';
import { convert_en2ru } from '@/utils/convert-layout';

interface SearchMatcherOptions {
  equels?: boolean;
}

interface IsMatchOptions {
  searchString: string;
  value: string;
}

export const isMatch = ({ searchString, value }: IsMatchOptions) => {
  const lowerValue = value.toLocaleLowerCase();
  const lowerSearchString = searchString.toLocaleLowerCase();
  const searchString2ruPc = convert_en2ru(searchString, 'pc');
  const searchString2ruMac = convert_en2ru(searchString, 'mac');
  return (
    lowerValue.includes(lowerSearchString) ||
    lowerValue.includes(searchString2ruPc) ||
    lowerValue.includes(searchString2ruMac)
  );
};

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
