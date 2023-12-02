import {
  SeriesDto,
  useAuthorsGetQuery,
  useBooksGetQuery,
  useSeriesEditMutation,
  useSeriesRemoveMutation,
} from '@/api/api';
import CustomAccordion from '@/components/common/CustomAccordion';
import DeleteButton from '@/components/common/DeleteButton';
import MultiSelect from '@/components/common/MultiSelect';
import useUpdatingState from '@/hooks/useUpdatingState';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getErrorMessage from '@/utils/getErrorMessage';
import { FormControl, Stack, TextField, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BooksInSeries from './BooksInSeries';

interface SeriesItemProps {
  item: SeriesDto;
}

const SeriesItem: FC<SeriesItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const [name, setName] = useUpdatingState(item.name);
  const [authors, setAuthors] = useUpdatingState(item.authors);
  const { data: authorsList = [], isLoading } = useAuthorsGetQuery();
  const [edit] = useSeriesEditMutation();
  const [remove] = useSeriesRemoveMutation();
  const dispatch = useAppDispatch();
  const { data: books = [] } = useBooksGetQuery();
  const booksInSeries = useMemo(
    () => books.filter(({ info }) => info.series.some(({ id }) => id === item.id)),
    [books]
  );

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

  const handleRemove = async () => {
    try {
      await remove({ id: item.id }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Series remove failed')) }));
    }
  };

  return (
    <CustomAccordion
      summary={
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            {item.name} ({t('{{count}} books', { count: booksInSeries.length })})
          </Typography>
          <DeleteButton
            confirmationTitle={t('Remove series?')}
            confirmationBody={t('Remove series {{name}}?', { name: item.name })}
            onConfirm={handleRemove}
          />
        </Stack>
      }
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
            <BooksInSeries books={booksInSeries} />
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
