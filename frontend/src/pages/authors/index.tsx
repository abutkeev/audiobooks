import { useAuthorsGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorItem from './AuthorItem';
import useTitle from '@/hooks/useTitle';
import useSearchMatcher from '@/hooks/useSearchMatcher';

const Authors: FC = () => {
  const { data = [], isLoading, isError } = useAuthorsGetQuery();
  const { t } = useTranslation();
  useTitle(t('Authors'));
  const searchMatcher = useSearchMatcher();

  const authors = useMemo(() => {
    if (!searchMatcher) return data;

    return data.filter(({ id, name }) => searchMatcher(id, { equels: true }) || searchMatcher(name));
  }, [data, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={authors.length === 0} message={searchMatcher ? t('No authors found') : t('No authors')}>
        {authors.map(item => (
          <AuthorItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Authors;
