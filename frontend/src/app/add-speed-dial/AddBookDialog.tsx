import { useState } from 'react';
import { Stack } from '@mui/material';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch } from '@/store';
import { addSnackbar } from '@/store/features/snackbars';
import { BookInfoDto, useBooksCreateMutation } from '@/api/api';
import { useTranslation } from 'react-i18next';
import getErrorMessage from '@/utils/getErrorMessage';
import CustomSwitch from '@/components/common/CustomSwitch';
import { useNavigate } from 'react-router-dom';
import BookInfoEditForm from '@/components/book-info-edit-form';

interface AddBookDialogProps {
  open: boolean;
  close(): void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({ open, close }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [readers, setReaders] = useState<string[]>([]);
  const [series, setSeries] = useState<BookInfoDto['series']>([]);
  const [draft, setDraft] = useState<boolean>();
  const [gotoBookEditPage, setGotoBookEditPage] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [create] = useBooksCreateMutation();

  const valid = !!name && authors.length !== 0 && readers.length !== 0;

  const handleCreate = async () => {
    try {
      const id = await create({
        bookInfoDto: {
          name,
          authors,
          readers,
          series,
          draft,
        },
      }).unwrap();
      if (gotoBookEditPage) {
        navigate(`/edit/${id}`);
      }
    } catch (e) {
      const text = getErrorMessage(e, t(`got unknown error while creating book`));
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleClose = () => {
    close();
    setName('');
    setAuthors([]);
    setReaders([]);
    setSeries([]);
  };

  return (
    <CustomDialog
      open={!!open}
      title={t(`Add book`)}
      close={handleClose}
      onConfirm={handleCreate}
      confirmButtonText={t('Create')}
      confirmButtonProps={{ disabled: !valid }}
      content={
        <Stack spacing={2}>
          <BookInfoEditForm
            name={name}
            setName={setName}
            authors={authors}
            setAuthors={setAuthors}
            readers={readers}
            setReaders={setReaders}
            series={series}
            setSeries={setSeries}
            draft={draft}
            setDraft={setDraft}
          />
          <CustomSwitch label={t('Goto book edit page')} checked={gotoBookEditPage} onChange={setGotoBookEditPage} />
        </Stack>
      }
    />
  );
};

export default AddBookDialog;
