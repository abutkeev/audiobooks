import { Toolbar } from '@mui/material';
import useMiniPlayerState from './useMiniPlayerState';

/** The spacer under the fixed bar has to repeat every row of it, or the content hides behind. */
const MiniPlayerSpacer: React.FC = () => {
  const { visible } = useMiniPlayerState();

  if (!visible) return null;

  return <Toolbar variant='dense' />;
};

export default MiniPlayerSpacer;
