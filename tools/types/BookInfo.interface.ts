import BookCover from './BookCover.interface';

interface BookInfo {
  name: string;
  author_id: string;
  reader_id: string;
  series_id?: string;
  series_number?: string;
  cover?: BookCover;
}

export default BookInfo;
