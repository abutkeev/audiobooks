import { BookEntryDto, PositionDto } from '@/api/api';

export interface BookWithPosition {
  book: BookEntryDto;
  position: PositionDto;
}

const getBooksWithPositions = (positions: PositionDto[], bookList: BookEntryDto[]): BookWithPosition[] =>
  positions
    .reduce((result: BookWithPosition[], position) => {
      if (position.currentChapter === 0 && position.position === 0) {
        return result;
      }

      const index = result.findIndex(({ book }) => book.id === position.bookId);
      if (index !== -1) {
        if (new Date(result[index].position.updated) < new Date(position.updated)) {
          result[index].position = position;
        }
        return result;
      }

      const book = bookList.find(({ id }) => id === position.bookId);
      if (!book) {
        return result;
      }

      result.push({ book, position });
      return result;
    }, [])
    .sort((a, b) => new Date(b.position.updated).getTime() - new Date(a.position.updated).getTime());

export default getBooksWithPositions;
