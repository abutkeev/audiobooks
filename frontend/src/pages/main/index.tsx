import useTitle from '@/hooks/useTitle';
import BookList from './BookList';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { currentBookVarName } from '../Home';
import { useSearchParams } from 'react-router-dom';
import MyBooks from './MyBooks';
import FriendsBooks from './FriendsBooks';

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('Book list'));
  const [searchParams] = useSearchParams();
  const { author_id, reader_id, series_id } = Object.fromEntries(searchParams);
  const [currentTab, setCurrentTab] = useState('my');

  const showTabs = !author_id && !reader_id && !series_id;

  useEffect(() => {
    localStorage.removeItem(currentBookVarName);
  }, []);

  return (
    <>
      {showTabs && (
        <Tabs value={currentTab} onChange={(_, index) => setCurrentTab(index)} sx={{ mb: 1 }}>
          <Tab value='my' label={t('My current books')} />
          <Tab value='friends' label={t("Friends' current books")} />
          <Tab value='all' label={t('All books')} />
        </Tabs>
      )}

      {showTabs && currentTab === 'my' && <MyBooks />}
      {showTabs && currentTab === 'friends' && <FriendsBooks />}
      {(!showTabs || currentTab === 'all') && <BookList />}
    </>
  );
};

export default MainPage;
