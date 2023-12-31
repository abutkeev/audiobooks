import { BookInfoDto, useSeriesGetQuery } from '@/api/api';
import { Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MultiSelect from '@/components/common/MultiSelect';
import { useMemo } from 'react';

interface SeriesEditFormProps {
  series: BookInfoDto['series'];
  setSeries(v: BookInfoDto['series']): void;
  authors: string[];
}

const SeriesEditForm: React.FC<SeriesEditFormProps> = ({ series, setSeries, authors }) => {
  const { t } = useTranslation();
  const { data: seriesList = [], isLoading: seriesLoading } = useSeriesGetQuery();

  const seriesFiltred = useMemo(
    () => seriesList.filter(entry => authors.some(author_id => entry.authors.some(id => id === author_id))),
    [seriesList, authors]
  );

  const handleSeriesChange = (ids: string[]) => {
    const newSeries = series.filter(({ id }) => ids.includes(id));
    for (const id of ids) {
      if (!newSeries.some(entry => entry.id === id)) {
        newSeries.push({ id });
      }
    }
    setSeries(newSeries);
  };

  const getSeriesNumberChangeHandler =
    (id: string): TextFieldProps['onChange'] =>
    ({ target: { value } }) => {
      const index = series.findIndex(entry => entry.id === id);
      if (index === -1) return;
      const newSeries = [...series];
      newSeries[index] = { id, number: value };
      setSeries(newSeries);
    };

  const getSeriesName = (id: string) => {
    const { name } = seriesList.find(entry => entry.id === id) || {};
    return name || id;
  };

  return (
    <Stack spacing={2}>
      <MultiSelect
        list={seriesFiltred}
        extraOptions={seriesList}
        label={t('Series')}
        values={series.map(({ id }) => id)}
        onChange={handleSeriesChange}
        loading={seriesLoading}
        selectOptionsText={t('Select series')}
        noOptionsText={t('No series')}
      />
      {series.map(({ id, number }) => (
        <TextField
          key={id}
          fullWidth
          label={t('Number in {{series}} series', { series: getSeriesName(id) })}
          value={number || ''}
          onChange={getSeriesNumberChangeHandler(id)}
        />
      ))}
    </Stack>
  );
};

export default SeriesEditForm;
