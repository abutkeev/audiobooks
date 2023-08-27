import { Box } from '@mui/material';
import { useGetBookQuery } from '../api/api';
import Player from '../components/Player';

const MainPage: React.FC = () => {
  const bookId = 'AE0BEB1C-1C28-4E2F-BDCA-3C5B5F4EE877';
  const { data } = useGetBookQuery({ id: bookId });

  if (!data) return null;
  return (
    <Box display='flex' justifyContent='center'>
      <Player bookId={bookId} chapters={data.chapters} />
    </Box>
  );
};

export default MainPage;
