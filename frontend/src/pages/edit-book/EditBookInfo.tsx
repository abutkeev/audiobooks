import { BookInfoDto, ChapterDto, useBooksEditMutation } from '@/api/api';
import { Button, Stack } from '@mui/material';
import { addSnackbar } from '@/store/features/snackbars';
import { useAppDispatch } from '@/store';
import { useTranslation } from 'react-i18next';
import useUpdatingState from '@/hooks/useUpdatingState';
import BookInfoEditForm from '@/components/book-info-edit-form';

interface EditBookInfoProps {
  id: string;
  info: BookInfoDto;
  chapters: ChapterDto[];
}

const EditBookInfo: React.FC<EditBookInfoProps> = ({ id, info, chapters }) => {
  const { t } = useTranslation();
  const [save] = useBooksEditMutation();
  const [name, setName] = useUpdatingState(info.name);
  const [authors, setAuthors] = useUpdatingState(info.authors);
  const [readers, setReaders] = useUpdatingState(info.readers);
  const [series, setSeries] = useUpdatingState(info.series);
  const [draft, setDraft] = useUpdatingState(info.draft);
  const dispatch = useAppDispatch();

  const modified =
    name !== info.name ||
    authors !== info.authors ||
    readers !== info.readers ||
    series !== info.series ||
    info.draft !== draft;
  const valid = !!name && authors.length !== 0 && readers.length !== 0;

  const handleSave = () => {
    const { cover } = info;
    try {
      const info: BookInfoDto = {
        name,
        authors,
        readers,
        series,
        cover,
        draft,
      };
      save({ id, bookDto: { info, chapters } }).unwrap();
    } catch (e) {
      const text = e instanceof Error ? e.message : t(`got unknown error while editing book`);
      dispatch(addSnackbar({ severity: 'error', text }));
    }
  };

  const handleCancel = () => {
    setName(info.name);
    setAuthors(info.authors);
    setReaders(info.readers);
    setSeries(info.series);
    setDraft(info.draft);
  };

  return (
    <Stack spacing={1}>
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
      {modified && (
        <Stack direction='row' spacing={1} mt={1}>
          <Button variant='outlined' onClick={handleCancel}>
            {t('Cancel')}
          </Button>
          <Button variant='contained' disabled={!valid} onClick={handleSave}>
            {t('Save')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default EditBookInfo;
