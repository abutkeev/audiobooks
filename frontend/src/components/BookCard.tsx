import { Edit, Mic, LibraryBooks, NavigateNext, AutoStories } from '@mui/icons-material';
import { Card, CardContent, Typography, Stack, Tooltip, Hidden, IconButton } from '@mui/material';
import Link from './common/Link';
import { useMemo } from 'react';
import { BookInfoDto, useBooksGetQuery } from '@/api/api';
import useAuthData from '@/hooks/useAuthData';
import { useTranslation } from 'react-i18next';

interface BookCardProps {
  id: string;
  list?: boolean;
  info: BookInfoDto;
  authorsList: Record<string, string>;
  readersList: Record<string, string>;
  seriesList: Record<string, string>;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  list,
  info: { name, authors, readers, series, cover },
  authorsList,
  readersList,
  seriesList,
}) => {
  const { t } = useTranslation();
  const { data: books } = useBooksGetQuery();
  const { admin } = useAuthData() || {};
  const nextBooks = useMemo(() => {
    if (!books || list || series.length === 0) return [];
    const nextBooks = series.map(({ id, number }) =>
      books.find(
        book => !!number && book.info.series.some(series => series.id === id && series.number === `${+number + 1}`)
      )
    );
    return nextBooks;
  }, [books, list, series]);

  return (
    <Card raised square>
      <Stack direction='row' flexGrow={1} alignContent='center'>
        <Hidden mdDown>
          {cover ? (
            <img width={200} src={cover.filename} style={{ margin: 5, borderRadius: 5 }} />
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
          {authors.map(author_id => (
            <Stack direction='row' spacing={1} key={author_id}>
              <Edit />
              <Typography>
                <Link to={`/books?author_id=${author_id}`}>{authorsList[author_id] ?? author_id}</Link>
              </Typography>
            </Stack>
          ))}
          {readers.map(reader_id => (
            <Stack direction='row' spacing={1} key={reader_id}>
              <Mic />
              <Typography>
                <Link to={`/books?reader_id=${reader_id}`}> {readersList[reader_id] ?? reader_id}</Link>
              </Typography>
            </Stack>
          ))}
          {series.map(({ id, number }, index) => (
            <Stack direction='row' spacing={1} key={id}>
              <LibraryBooks />
              <Typography>
                <Link to={`/books?series_id=${id}`}>
                  {seriesList[id] ?? id} {number && `(${number})`}
                </Link>
              </Typography>
              {nextBooks[index] && (
                <>
                  <NavigateNext />
                  <Tooltip title={t('Next book')}>
                    <Typography>
                      <Link to={`/book/${nextBooks[index]!.id}`}>{nextBooks[index]!.info.name}</Link>
                    </Typography>
                  </Tooltip>
                </>
              )}
            </Stack>
          ))}
        </CardContent>
      </Stack>
    </Card>
  );
};

export default BookCard;
