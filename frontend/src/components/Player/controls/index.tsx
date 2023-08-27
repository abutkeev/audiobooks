import {
  Forward10,
  Pause,
  PlayArrow,
  Replay10,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';
import { Grid, Paper, Slider, Stack, Typography } from '@mui/material';
import React from 'react';
import ControlButton from './ControlButton';
import VolumeControl from './VolumeControl';

interface ControlsProps {
  position: number;
  duration?: number;
  volume?: number;
  playing: boolean;
  firstChapter?: boolean;
  lastChapter?: boolean;
  handlePositionChange(newPosition: number): void;
  handlePreviousChapter(): void;
  handleNextChapter(): void;
  handlePlayPause(): void;
  handleVolumeChange(newLevel: number): void;
}

const formatTime = (time: number) => {
  if (time < 0) return;
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  if (hours === 0) return `${formattedMinutes}:${formattedSeconds}`;
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

const Controls: React.FC<ControlsProps> = ({
  position,
  duration,
  volume,
  playing,
  firstChapter,
  lastChapter,
  handlePositionChange,
  handlePreviousChapter,
  handleNextChapter,
  handlePlayPause,
  handleVolumeChange,
}) => {
  const handleRewind = () => handlePositionChange(position > 10 ? position - 10 : 0);
  const handleForward = () => duration && handlePositionChange(position + 10 < duration ? position + 10 : duration);
  React.useEffect(() => {
    navigator.mediaSession.setActionHandler('previoustrack', handleRewind);
    navigator.mediaSession.setActionHandler('nexttrack', handleForward);
    return () => {
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [position, duration]);
  return (
    <Paper square sx={{ p: 1 }}>
      <Stack direction='row' justifyContent='center'>
        <ControlButton Icon={SkipPrevious} disabled={firstChapter} onClick={handlePreviousChapter} />
        <ControlButton Icon={Replay10} onClick={handleRewind} disabled={!position} />
        <ControlButton main Icon={playing ? Pause : PlayArrow} onClick={handlePlayPause} />
        <ControlButton Icon={Forward10} onClick={handleForward} disabled={!duration || position === duration} />
        <ControlButton Icon={SkipNext} disabled={lastChapter} onClick={handleNextChapter} />
      </Stack>
      <Grid container p={1}>
        <Grid item xs={4}>
          <VolumeControl volume={volume} handleVolumeChange={handleVolumeChange} />
        </Grid>
      </Grid>
      {duration && (
        <Stack spacing={2} direction='row' mx={1}>
          <Typography>{formatTime(position)}</Typography>
          <Slider
            value={position}
            onChange={(_, position) => typeof position === 'number' && handlePositionChange(position)}
            max={duration}
            valueLabelDisplay='auto'
            valueLabelFormat={formatTime}
          />
          <Typography>{formatTime(duration)}</Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default Controls;
