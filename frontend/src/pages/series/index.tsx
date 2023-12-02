import { useSeriesGetQuery } from '@/api/api';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SeriesItem from './SeriesItem';

const Series: FC = () => {
  const { data: series = [], isLoading, isError } = useSeriesGetQuery();
  const { t } = useTranslation();

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
