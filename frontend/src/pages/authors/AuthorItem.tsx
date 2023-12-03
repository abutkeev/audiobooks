import { PersonDto, useAuthorsEditMutation, useAuthorsRemoveMutation, useBooksGetQuery } from '@/api/api';
import CustomAccordion from '@/components/common/CustomAccordion';
import DeleteButton from '@/components/common/DeleteButton';
import useUpdatingState from '@/hooks/useUpdatingState';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import getErrorMessage from '@/utils/getErrorMessage';
import { FormControl, Stack, TextField, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BooksAccordion from '../../components/BooksAccordion';

interface AuthorItemProps {
  item: PersonDto;
}

const AuthorItem: FC<AuthorItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const [name, setName] = useUpdatingState(item.name);
  const dispatch = useAppDispatch();
  const { data: books = [] } = useBooksGetQuery();
  const [edit] = useAuthorsEditMutation();
  const [remove] = useAuthorsRemoveMutation();
  const booksFiltred = useMemo(() => books.filter(({ info }) => info.authors.includes(item.id)), [books]);
  const onlyAuthorBookName = useMemo(
    () => booksFiltred.find(({ info }) => info.authors.length === 1)?.info.name,
    [booksFiltred]
  );

  const modified = name !== item.name;
  const valid = !!name;

  const handleUpdate = async () => {
    try {
      await edit({ id: item.id, nameDto: { name } }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Author update failed')) }));
    }
  };

  const handleCancel = () => {
    setName(item.name);
  };

  const handleRemove = async () => {
    try {
      await remove({ id: item.id }).unwrap();
    } catch (e) {
      dispatch(addSnackbar({ severity: 'error', text: getErrorMessage(e, t('Author remove failed')) }));
    }
  };

  return (
    <CustomAccordion
      summary={
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <Typography flexGrow={1} noWrap>
            {item.name} ({t('{{count}} books', { count: booksFiltred.length })})
          </Typography>
          <DeleteButton
            confirmationTitle={t('Remove author?')}
            confirmationBody={t('Remove author {{name}} ({{count}} books)?', {
              name: item.name,
              count: booksFiltred.length,
            })}
            onConfirm={handleRemove}
            deleteButtonProps={
              onlyAuthorBookName
                ? { disabled: true, tooltip: t('The only author of book {{name}}', { name: onlyAuthorBookName }) }
                : undefined
            }
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
            <BooksAccordion books={booksFiltred} />
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

export default AuthorItem;
