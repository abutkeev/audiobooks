import { useState } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from '../../components/common/CustomDialog';
import { useAppDispatch } from '../../store';
import { addSnackbar } from '../../store/features/snackbars';
import { useAuthorsGetQuery, useBooksCreateMutation, useReadersGetQuery, useSeriesGetQuery } from '../../api/api';
import CustomComboBox from '../../components/common/CustomComboBox';
import LoadingWrapper from '../../components/common/LoadingWrapper';

interface AddBookDialogProps {
  open: boolean;
  close(): void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({ open, close }) => {
  const [name, setName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [readerId, setReaderId] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [seriesNumber, setSeriesNumber] = useState('');
  const dispatch = useAppDispatch();
  const { data: authors = [], isLoading: authorsLoading, isError: authorsError } = useAuthorsGetQuery();
  const { data: readers = [], isLoading: readersLoading, isError: readersError } = useReadersGetQuery();
  const { data: series = [], isLoading: seriesLoading, isError: seriesError } = useSeriesGetQuery();
  const [create] = useBooksCreateMutation();

  const loading = authorsLoading || readersLoading || seriesLoading;
  const error = authorsError || readersError || seriesError;
  const valid = !!name && !!authorId && !!readerId;

  const handleCreate = () => {
    try {
      create({
        bookInfoDto: {
          name,
          author_id: authorId,
          reader_id: readerId,
          series_id: seriesId || undefined,
          series_number: (seriesId && seriesNumber) || undefined,
        },
      }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : `got unknown error while creating book`;
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
    setAuthorId('');
    setReaderId('');
    setSeriesId('');
    setSeriesNumber('');
  };

  return (
    <CustomDialog
      open={!!open}
      title={`Add series`}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText='Create'
      confirmButtonProps={{ disabled: !valid || loading || error }}
      content={
        <LoadingWrapper loading={loading} error={error}>
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            required
            label='Name'
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            onKeyDown={e => e.stopPropagation()}
            error={!name}
          />
          <CustomComboBox options={authors} label='Author' value={authorId} setValue={setAuthorId} />
          <CustomComboBox options={readers} label='Reader' value={readerId} setValue={setReaderId} />
          <CustomComboBox options={series} label='Series' value={seriesId} setValue={setSeriesId} required={false} />
          <TextField
            fullWidth
            label='Series number'
            value={seriesId ? seriesNumber : ''}
            disabled={!seriesId}
            onChange={({ target: { value } }) => setSeriesNumber(value)}
          />
        </LoadingWrapper>
      }
    />
  );
};

export default AddBookDialog;
