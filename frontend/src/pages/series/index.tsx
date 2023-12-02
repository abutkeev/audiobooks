import { useSeriesGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SeriesItem from './SeriesItem';
import useTitle from '@/hooks/useTitle';

const Series: FC = () => {
  const { data: series = [], isLoading, isError } = useSeriesGetQuery();
  const { t } = useTranslation();
  useTitle(t('Series'));

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <EmptyListWrapper wrap={series.length === 0} message={t('No series')}>
        {series.map(item => (
          <SeriesItem key={item.id} item={item} />
        ))}
      </EmptyListWrapper>
    </LoadingWrapper>
  );
};

export default Series;
