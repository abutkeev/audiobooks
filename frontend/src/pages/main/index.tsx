import useTitle from '@/hooks/useTitle';
import BookList from './BookList';
import { useTranslation } from 'react-i18next';

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('Book list'));

  return <BookList />;
};

export default MainPage;
