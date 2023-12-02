import { BookInfoDto, useSeriesGetQuery } from '@/api/api';
import { Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MultiSelect from '@/components/common/MultiSelect';

interface SeriesEditFormProps {
  series: BookInfoDto['series'];
  setSeries(v: BookInfoDto['series']): void;
}

const SeriesEditForm: React.FC<SeriesEditFormProps> = ({ series, setSeries }) => {
  const { t } = useTranslation();
  const { data: seriesList = [], isLoading: seriesLoading } = useSeriesGetQuery();

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
        list={seriesList}
        label={t('Series')}
        values={series.map(({ id }) => id)}
        onChange={handleSeriesChange}
        loading={seriesLoading}
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
