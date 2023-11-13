import { useParams } from 'react-router-dom';
import { useBooksGetBookInfoQuery } from '../../api/api';
import LoadingWrapper from '../../components/common/LoadingWrapper';
import useTitle from '../../hooks/useTitle';
import EditBookInfo from './EditBookInfo';
import { useMemo, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import EditChapters from './EditChapters';
import Link from '../../components/common/Link';
import EditCover from './EditCover';
import { useTranslation } from 'react-i18next';

const EditBookPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const { data: { info, chapters: originalChapters = [] } = {}, isLoading, isError } = useBooksGetBookInfoQuery({ id });
  const [tabIndex, setTabIndex] = useState(0);
  const chapters = useMemo(
    () =>
      originalChapters.map(({ title, filename: url }) => {
        const entries = url.split('/');
        const filename = decodeURI(entries[entries.length - 1]);
        return { title, filename };
      }),
    [originalChapters]
  );
  useTitle(`${t('Edit.title', 'Edit')} ${info?.name || ''}`);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      <Link to={`/book/${id}`}>{t('Go to book page')}</Link>
      <Tabs value={tabIndex} onChange={(_, index) => setTabIndex(index)} sx={{ mb: 1 }}>
        <Tab value={0} label={t('Info')} />
        <Tab value={1} label={t('Chapters')} />
        <Tab value={2} label={t('Cover')} />
      </Tabs>
      {info && tabIndex === 0 && <EditBookInfo id={id} info={info} chapters={chapters} />}
      {tabIndex === 1 && <EditChapters bookId={id} chapters={chapters} />}
      {tabIndex === 2 && <EditCover bookId={id} cover={info?.cover?.filename} />}
    </LoadingWrapper>
  );
};

export default EditBookPage;
