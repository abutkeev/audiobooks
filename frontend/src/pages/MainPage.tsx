import { Box } from '@mui/material';
import { useGetBookQuery } from '../api/api';
import Player from '../components/Player';
import LoadingWrapper from '../components/common/LoadingWrapper';

const MainPage: React.FC = () => {
  const bookId = 'AE0BEB1C-1C28-4E2F-BDCA-3C5B5F4EE877';
  const { data, isLoading, isError } = useGetBookQuery({ id: bookId });

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      {data && (
        <Box display='flex' justifyContent='center'>
          <Player bookId={bookId} chapters={data.chapters} />
        </Box>
      )}
    </LoadingWrapper>
  );
};

export default MainPage;
