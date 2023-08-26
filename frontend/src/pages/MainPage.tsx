import { Box } from '@mui/material';
import { useGetBookQuery } from '../api/api';
import Player from '../components/Player';

const MainPage: React.FC = () => {
  const bookId = 'book1';
  const { data } = useGetBookQuery({ id: bookId });

  if (!data) return null;
  return (
    <Box display='flex' justifyContent='center'>
      <Player bookId={bookId} chapters={data.chapters} />
    </Box>
  );
};

export default MainPage;
