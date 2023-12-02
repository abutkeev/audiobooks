import { SeriesDto, useAuthorsGetQuery, useSeriesEditMutation } from '@/api/api';
import CustomAccordion from '@/components/common/CustomAccordion';
import MultiSelect from '@/components/common/MultiSelect';
import useUpdatingState from '@/hooks/useUpdatingState';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getErrorMessage from '@/utils/getErrorMessage';
import { FormControl, Stack, TextField } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface SeriesItemProps {
  item: SeriesDto;
}

const SeriesItem: FC<SeriesItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const [name, setName] = useUpdatingState(item.name);
  const [authors, setAuthors] = useUpdatingState(item.authors);
  const { data: authorsList = [], isLoading } = useAuthorsGetQuery();
  const [edit] = useSeriesEditMutation();
  const dispatch = useAppDispatch();

  const modified = name !== item.name || authors !== item.authors;
  const valid = !!name && authors.length !== 0;

  const handleUpdate = async () => {
    try {
      await edit({ id: item.id, newSeriesDto: { name, authors } }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Series update failed')) }));
    }
  };

  const handleCancel = () => {
    setName(item.name);
    setAuthors(item.authors);
  };

  return (
    <CustomAccordion
      summary={item.name}
      details={
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label={t('Name')}
              value={name}
              required
              error={!name}
              onChange={({ target: { value } }) => setName(value)}
            />
            <MultiSelect
              list={authorsList}
              values={authors}
              onChange={setAuthors}
              loading={isLoading}
              label={t('Authors')}
              required
              selectOptionsText={t('Select authors')}
              noOptionsText={t('No authors')}
            />
          </Stack>
        </FormControl>
      }
      modified={modified}
      valid={valid}
      handleCancel={handleCancel}
      handleUpdate={handleUpdate}
    />
  );
};

export default SeriesItem;
