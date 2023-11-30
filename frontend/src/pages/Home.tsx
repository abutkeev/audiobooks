import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import BookList from './BookList';
import { useBooksGetQuery } from '@/api/api';

export const currentBookVarName = 'currentBook';

const Home: React.FC = () => {
  const currentBook = localStorage.getItem(currentBookVarName);
  const { data, isLoading, isError } = useBooksGetQuery();

  const navigate = useNavigate();
  const initialRenderRef = useRef(true);

  useEffect(() => {
    if (initialRenderRef.current && currentBook && data && data.find(({ id }) => id === currentBook)) {
      navigate(`/book/${currentBook}`, { replace: true });
      initialRenderRef.current = false;
    }
  }, [currentBook, data]);

  if (isLoading || isError) {
    return <LoadingWrapper loading={isLoading} error={isError} />;
  }

  return <BookList />;
};

export default Home;
