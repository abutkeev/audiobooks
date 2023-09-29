import { Edit, Mic, LibraryBooks, NavigateNext, AutoStories } from '@mui/icons-material';
import { Card, CardContent, Typography, Stack, Tooltip, Hidden, IconButton } from '@mui/material';
import Link from './common/Link';
import { useMemo } from 'react';
import { BookInfoDto, useBooksGetQuery } from '../api/api';
import useAuthData from '../hooks/useAuthData';

interface BookCardProps {
  id: string;
  list?: boolean;
  info: BookInfoDto;
  authors: Record<string, string>;
  readers: Record<string, string>;
  series: Record<string, string>;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  list,
  info: { name, author_id, reader_id, series_id, series_number, cover },
  authors,
  readers,
  series,
}) => {
  const { data: books } = useBooksGetQuery();
  const { admin } = useAuthData() || {};
  const nextBook = useMemo(() => {
    if (!books || list || !series_id || !series_number) return undefined;
    const nextBook = books.find(
      book =>
        book.info.series_id === series_id && book.info.series_number && +book.info.series_number === +series_number + 1
    );
    if (!nextBook) return undefined;
    return { id: nextBook.id, name: nextBook.info.name };
  }, [books, list, series_id, series_number]);
  return (
    <Card raised square>
      <Stack direction='row' flexGrow={1} alignContent='center'>
        <Hidden mdDown>
          {cover ? (
            <img width={200} height={200} src={cover.filename} style={{ margin: 5, borderRadius: 5 }} />
          ) : (
            <AutoStories sx={{ width: 200, height: 200 }} color='primary' />
          )}
        </Hidden>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction='row' spacing={1}>
            <Typography variant='h6' sx={{ cursor: 'default' }} flexGrow={1} noWrap>
              {list ? <Link to={`/book/${id}`}>{name}</Link> : name}
            </Typography>
            {admin && (
              <IconButton component={Link} to={`/edit/${id}`}>
                <Edit />
              </IconButton>
            )}
          </Stack>
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
