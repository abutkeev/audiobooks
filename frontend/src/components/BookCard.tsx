import { Edit, Mic, LibraryBooks, NavigateNext, AutoStories } from '@mui/icons-material';
import { Card, CardContent, Typography, Stack, Tooltip, Hidden } from '@mui/material';
import { BookInfo, useGetBooksQuery } from '../api/api';
import Link from './common/Link';
import { useMemo } from 'react';

interface BookCardProps {
  id?: string;
  info: BookInfo;
  authors: Record<string, string>;
  readers: Record<string, string>;
  series: Record<string, string>;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  info: { name, author_id, reader_id, series_id, series_number, cover },
  authors,
  readers,
  series,
}) => {
  const { data: books } = useGetBooksQuery();
  const nextBook = useMemo(() => {
    if (!books || id || !series_id || !series_number) return undefined;
    const nextBook = books.find(
      book =>
        book.info.series_id === series_id && book.info.series_number && +book.info.series_number === +series_number + 1
    );
    if (!nextBook) return undefined;
    return { id: nextBook.id, name: nextBook.info.name };
  }, [books, id, series_id, series_number]);
  return (
    <Card sx={{ maxWidth: 'md', mx: 'auto' }} raised>
      <Stack direction='row'>
        <Hidden mdDown>
          {cover ? (
            <img width={200} height={200} src={cover.filename} />
          ) : (
            <AutoStories sx={{ width: 200, height: 200 }} color='primary' />
          )}
        </Hidden>
        <CardContent>
          <Typography variant='h6' sx={{ cursor: 'default' }}>
            {id ? <Link to={`/book/${id}`}>{name}</Link> : name}
          </Typography>
          <Stack direction='row' spacing={1}>
            <Edit />
            <Typography>
              <Link to={`/books?author_id=${author_id}`}>{authors[author_id] ?? author_id}</Link>
            </Typography>
          </Stack>
          <Stack direction='row' spacing={1}>
            <Mic />
            <Typography>
              <Link to={`/books?reader_id=${reader_id}`}> {readers[reader_id] ?? reader_id}</Link>
            </Typography>
          </Stack>
          {series_id && (
            <Stack direction='row' spacing={1}>
              <LibraryBooks />
              <Typography>
                <Link to={`/books?series_id=${series_id}`}>
                  {series[series_id] ?? series_id} {series_number && `(${series_number})`}
                </Link>
              </Typography>
              {nextBook && (
                <>
                  <NavigateNext />
                  <Tooltip title='Next book'>
                    <Typography>
                      <Link to={`/book/${nextBook.id}`}>{nextBook.name}</Link>
                    </Typography>
                  </Tooltip>
                </>
              )}
            </Stack>
          )}
        </CardContent>
      </Stack>
    </Card>
  );
};

export default BookCard;
