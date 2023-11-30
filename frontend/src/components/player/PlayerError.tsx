import { Alert } from '@mui/material';
import { useAppSelector } from '@/store';

const PlayerError: React.FC = () => {
  const error = useAppSelector(
    ({
      player: {
        state: { error },
      },
    }) => error
  );

  if (!error) return;

  return <Alert severity='error'>{error}</Alert>;
};

export default PlayerError;
