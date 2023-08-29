import { useContext } from 'react';
import { PlayerStateContext } from './state/usePlayerState';
import { Alert } from '@mui/material';

const PlayerError: React.FC = () => {
  const {
    state: { error },
  } = useContext(PlayerStateContext);

  if (!error) return;

  return <Alert severity='error'>{error}</Alert>;
};

export default PlayerError;
