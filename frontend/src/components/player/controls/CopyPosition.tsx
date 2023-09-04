import { IosShare } from '@mui/icons-material';
import ControlButton from './ControlButton';
import { useContext } from 'react';
import { PlayerStateContext } from '../state/usePlayerState';
import copy from 'copy-to-clipboard';

const CopyPosition: React.FC = () => {
  const {
    state: { currentChapter, position },
    generateUrl,
  } = useContext(PlayerStateContext);
  const handleCopyClick = () => copy(generateUrl({ currentChapter, position }));
  return <ControlButton Icon={IosShare} small onClick={handleCopyClick} />;
};

export default CopyPosition;
