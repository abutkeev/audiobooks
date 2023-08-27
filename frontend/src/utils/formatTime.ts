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

export default formatTime;
