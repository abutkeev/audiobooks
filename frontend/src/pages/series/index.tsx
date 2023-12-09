import { useSeriesGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SeriesItem from './SeriesItem';
import useTitle from '@/hooks/useTitle';
import useSearchMatcher from '@/hooks/useSearchMatcher';
import useAuthors from '@/hooks/useAuthors';

const Series: FC = () => {
  const { data = [], isLoading, isError } = useSeriesGetQuery();
  const { authors, authorsLoading, authorsError } = useAuthors();
  const { t } = useTranslation();
  useTitle(t('Series'));
  const searchMatcher = useSearchMatcher();

  const series = useMemo(() => {
    if (!searchMatcher) return data;
    const filtredAuhorsIds = Object.entries(authors)
      .filter(([, name]) => searchMatcher(name))
      .map(([id]) => id);

    return data.filter(
      ({ id, name, authors }) =>
        searchMatcher(id, { equels: true }) ||
        searchMatcher(name) ||
        authors.some(author_id => filtredAuhorsIds.includes(author_id))
    );
  }, [data, authors, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading || authorsLoading} error={isError || authorsError}>
      <EmptyListWrapper wrap={series.length === 0} message={searchMatcher ? t('No series found') : t('No series')}>
        {series.map(item => (
          <SeriesItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Series;
