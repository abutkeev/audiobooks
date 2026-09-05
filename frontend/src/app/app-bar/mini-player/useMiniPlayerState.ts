import { useMatch } from 'react-router-dom';
import { useAppSelector } from '@/store';

/**
 * The player line is hidden on the page of the book holding it — that page has the full controls.
 * Closing is hidden on any book page: a freed player is taken over by the page at once, so the
 * cross would only reopen the book it just closed. There the play button of the page does the job.
 */
const useMiniPlayerState = () => {
  const bookId = useAppSelector(({ player }) => player.bookId);
  const match = useMatch('/book/:id');

  return {
    visible: !!bookId && match?.params.id !== bookId,
    closeable: !match,
  };
};

export default useMiniPlayerState;
