import { IosShare } from '@mui/icons-material';
import ControlButton from './ControlButton';
import { useAppDispatch, useAppSelector } from '../../../store';
import { copyUrl } from '../../../store/features/player';

const CopyPosition: React.FC = () => {
  const { currentChapter, position } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();
  const handleCopyClick = () => {
    return dispatch(copyUrl({ currentChapter, position }));
  };
  return <ControlButton Icon={IosShare} small onClick={handleCopyClick} />;
};

export default CopyPosition;
