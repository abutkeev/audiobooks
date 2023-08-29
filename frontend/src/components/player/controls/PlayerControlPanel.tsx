import { SkipPrevious, Replay10, Pause, PlayArrow, Forward10, SkipNext } from '@mui/icons-material';
import { Stack } from '@mui/material';
import ControlButton from './ControlButton';
import { useContext } from 'react';
import { PlayerStateContext, chapterChange, forward, playPause, rewind } from '../state/usePlayerState';

const PlayerControlPanel: React.FC = () => {
  const {
    state: { position, duration, currentChapter, playing },
    chapters,
    dispatch,
  } = useContext(PlayerStateContext);

  return (
    <Stack direction='row' justifyContent='center'>
      <ControlButton
        Icon={SkipPrevious}
        disabled={currentChapter === 0}
        onClick={() => dispatch(chapterChange(currentChapter - 1))}
      />
      <ControlButton
        Icon={Replay10}
        onClick={() => dispatch(rewind(10))}
        disabled={!position && currentChapter === 0}
      />
      <ControlButton main Icon={playing ? Pause : PlayArrow} onClick={() => dispatch(playPause())} />
      <ControlButton
        Icon={Forward10}
        onClick={() => dispatch(forward(10))}
        disabled={!duration || (position === duration && currentChapter === chapters.length - 1)}
      />
      <ControlButton
        Icon={SkipNext}
        disabled={currentChapter === chapters.length - 1}
        onClick={() => dispatch(chapterChange(currentChapter + 1))}
      />
    </Stack>
  );
};

export default PlayerControlPanel;
