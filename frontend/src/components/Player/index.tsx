import React from 'react';
import { Paper } from '@mui/material';
import Chapter from './Chapter';
import { Book } from '../../api/api';
import Controls from './controls';
import usePlayerState from './usePlayerState';

interface PlayerProps {
  bookId: string;
  chapters: Book['chapters'];
}

const Player: React.FC<PlayerProps> = ({ bookId, chapters }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { currentChapter, setCurrentChapter, position, setPosition } = usePlayerState(bookId);
  const [duration, setDuration] = React.useState<number>();
  const [playing, setPlaying] = React.useState(false);
  const updateSrc = (chapter: number) => {
    if (!audioRef.current) return;
    audioRef.current.src = `/api/books/${bookId}/${chapters[chapter].filename}`;
  };
  React.useEffect(() => {
    if (!audioRef.current) return;
    updateSrc(currentChapter);
    audioRef.current.currentTime = position;
    audioRef.current.oncanplay = () => {
      setDuration(audioRef.current?.duration);
    };
    audioRef.current.onplaying = () => setPlaying(true);
    audioRef.current.onpause = () => setPlaying(false);
    audioRef.current.onended = () =>
      setCurrentChapter(chapter => {
        if (chapter === chapters.length - 1) {
          setPosition(0);
          updateSrc(0);
          return 0;
        }
        const newChapter = chapter + 1;
        setPosition(0);
        if (!audioRef.current) return newChapter;
        updateSrc(newChapter);
        const play = () => {
          if (!audioRef.current) return;
          audioRef.current.play();
          audioRef.current.removeEventListener('canplay', play);
        };
        audioRef.current.addEventListener('canplay', play);
        return newChapter;
      });
    const intervalId = setInterval(() => audioRef.current && setPosition(audioRef.current.currentTime), 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [audioRef]);
  const handlePositionChange = (newPosition: number) => {
    if (!audioRef.current) return;
    setPosition(newPosition);
    audioRef.current.currentTime = newPosition;
  };
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) return audioRef.current.play();
    audioRef.current.pause();
  };
  const handleChapterClick = (chapter: number) => () => {
    setCurrentChapter(chapter);
    setPosition(0);
    if (!audioRef.current) return;
    updateSrc(chapter);
    if (playing) {
      audioRef.current.play();
    }
  };
  const handlePreviousChapter = () => handleChapterClick(currentChapter - 1)();
  const handleNextChapter = () => currentChapter !== chapters.length - 1 && handleChapterClick(currentChapter + 1)();

  return (
    <Paper sx={{ maxWidth: 'md', flexGrow: 1 }}>
      <Controls
        position={position}
        handlePositionChange={handlePositionChange}
        duration={duration}
        playing={playing}
        handlePreviousChapter={handlePreviousChapter}
        handleNextChapter={handleNextChapter}
        handlePlayPause={handlePlayPause}
        firstChapter={currentChapter === undefined || currentChapter === 0}
        lastChapter={currentChapter === undefined || currentChapter === chapters.length - 1}
      />
      {chapters.map(({ title }, i) => (
        <Chapter key={i} title={title} onClick={handleChapterClick(i)} current={currentChapter === i} />
      ))}
      <audio ref={audioRef} />
    </Paper>
  );
};

export default Player;
