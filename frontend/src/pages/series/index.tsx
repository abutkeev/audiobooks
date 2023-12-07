import { useSeriesGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SeriesItem from './SeriesItem';
import useTitle from '@/hooks/useTitle';
import useSearchMatcher from '@/hooks/useSearchMatcher';

const Series: FC = () => {
  const { data = [], isLoading, isError } = useSeriesGetQuery();
  const { t } = useTranslation();
  useTitle(t('Series'));
  const searchMatcher = useSearchMatcher();

  const series = useMemo(() => {
    if (!searchMatcher) return data;

    return data.filter(({ id, name }) => searchMatcher(id, { equels: true }) || searchMatcher(name));
  }, [data, searchMatcher]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={series.length === 0} message={searchMatcher ? t('No series found') : t('No series')}>
        {series.map(item => (
          <SeriesItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Series;
