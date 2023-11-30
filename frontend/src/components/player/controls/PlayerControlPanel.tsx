import { SkipPrevious, Replay10, Pause, PlayArrow, Forward10, SkipNext } from '@mui/icons-material';
import { Stack } from '@mui/material';
import ControlButton from './ControlButton';
import { useAppDispatch, useAppSelector } from '@/store';
import { chapterChange, forward, pause, play, rewind } from '@/store/features/player';

const PlayerControlPanel: React.FC = () => {
  const {
    state: { position, duration, currentChapter, playing },
    chapters,
  } = useAppSelector(({ player }) => player);
  const dispatch = useAppDispatch();

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
      {playing ? (
        <ControlButton main Icon={Pause} onClick={() => dispatch(pause())} />
      ) : (
        <ControlButton main Icon={PlayArrow} onClick={() => dispatch(play())} />
      )}
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
