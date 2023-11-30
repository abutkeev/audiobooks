import { useMemo } from 'react';
import { useSeriesGetQuery } from '@/api/api';

const useSeries = () => {
  const { data: seriesArray, isLoading: seriesLoading, isError: seriesError } = useSeriesGetQuery();
  const series = useMemo(
    () => (seriesArray ? Object.fromEntries(seriesArray.map(({ id, name }) => [id, name])) : {}),
    [seriesArray]
  );
  return { series, seriesArray, seriesLoading, seriesError };
};

export default useSeries;
