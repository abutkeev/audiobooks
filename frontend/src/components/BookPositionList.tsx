import { FC } from 'react';
import BookCard from './BookCard';
import { BookWithPosition } from '@/utils/getBooksWithPositions';

interface BookPositionListProps {
  books: BookWithPosition[];
  // owner of the listed positions, not the current user
  userId?: string;
  authorsList: Record<string, string>;
  readersList: Record<string, string>;
  seriesList: Record<string, string>;
}

const BookPositionList: FC<BookPositionListProps> = ({ books, userId, authorsList, readersList, seriesList }) => (
  <>
    {books.map(({ book: { id, info }, position: { updated } }) => (
      <BookCard
        key={id}
        id={id}
        info={info}
        authorsList={authorsList}
        readersList={readersList}
        seriesList={seriesList}
        list
        updated={updated}
        to={userId ? `/book/${id}?user_id=${userId}` : undefined}
      />
    ))}
  </>
);

export default BookPositionList;
