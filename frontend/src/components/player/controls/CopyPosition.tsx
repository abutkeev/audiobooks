import { IosShare } from '@mui/icons-material';
import ControlButton from './ControlButton';
import { useContext } from 'react';
import { PlayerStateContext } from '../state/usePlayerState';
import copy from 'copy-to-clipboard';
import { useAppDispatch } from '../../../store';
import { addSnackbar } from '../../../store/features/snackbars';

const CopyPosition: React.FC = () => {
  const {
    state: { currentChapter, position },
    generateUrl,
  } = useContext(PlayerStateContext);
  const dispatch = useAppDispatch();
  const handleCopyClick = () => {
    copy(generateUrl({ currentChapter, position }));
    dispatch(addSnackbar({ severity: 'success', text: 'Copied to clipboard', timeout: 2000 }));
  };
  return <ControlButton Icon={IosShare} small onClick={handleCopyClick} />;
};

export default CopyPosition;
