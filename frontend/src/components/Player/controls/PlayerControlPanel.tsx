import { SkipPrevious, Replay10, Pause, PlayArrow, Forward10, SkipNext } from '@mui/icons-material';
import { Stack } from '@mui/material';
import ControlButton from './ControlButton';
import { useContext } from 'react';
import { PlayerStateContext, changePosition, chapterChange, playPause } from '../usePlayerState';
import React from 'react';

const PlayerControlPanel: React.FC = () => {
  const {
    state: { position, duration, currentChapter, playing },
    chapters,
    dispatch,
  } = useContext(PlayerStateContext);

  const handlePlayPause = () => dispatch(playPause());
  const handlePreviousChapter = () => dispatch(chapterChange(currentChapter - 1));
  const handleNextChapter = () => currentChapter !== chapters.length - 1 && dispatch(chapterChange(currentChapter + 1));
  const handleRewind = () => dispatch(changePosition(position > 10 ? position - 10 : 0));
  const handleForward = () => duration && dispatch(changePosition(position + 10 < duration ? position + 10 : duration));

  React.useEffect(() => {
    navigator.mediaSession.setActionHandler('previoustrack', handleRewind);
    navigator.mediaSession.setActionHandler('nexttrack', handleForward);
    return () => {
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [position, duration]);

  return (
    <Stack direction='row' justifyContent='center'>
      <ControlButton Icon={SkipPrevious} disabled={currentChapter === 0} onClick={handlePreviousChapter} />
      <ControlButton Icon={Replay10} onClick={handleRewind} disabled={!position} />
      <ControlButton main Icon={playing ? Pause : PlayArrow} onClick={handlePlayPause} />
      <ControlButton Icon={Forward10} onClick={handleForward} disabled={!duration || position === duration} />
      <ControlButton Icon={SkipNext} disabled={currentChapter === chapters.length - 1} onClick={handleNextChapter} />
    </Stack>
  );
};

export default PlayerControlPanel;
