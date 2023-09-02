import { useNavigate } from 'react-router-dom';
import { useGetBooksQuery } from '../api/api';
import LoadingWrapper from '../components/common/LoadingWrapper';
import BookList from './BookList';

export const currentBookVarName = 'currentBook';

const Home: React.FC = () => {
  const currentBook = localStorage.getItem(currentBookVarName);
  const { data, isLoading, isError } = useGetBooksQuery();
  const navigate = useNavigate();
  if (isLoading || isError) {
    return <LoadingWrapper loading={isLoading} error={isError} />;
  }
  if (currentBook && data && data.find(({ id }) => id === currentBook)) {
    navigate(`/book/${currentBook}`);
    return;
  }

  return <BookList />;
};

export default Home;
