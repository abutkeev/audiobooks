import { useMemo } from 'react';
import { readSavedBookState } from '@/store/features/player';

/** Where the book stands while another one holds the player: the store keeps the playing book only. */
const useSavedBookState = (bookId: string, chaptersCount: number) =>
  useMemo(() => readSavedBookState(bookId, chaptersCount), [bookId, chaptersCount]);

export default useSavedBookState;
