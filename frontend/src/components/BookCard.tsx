import { Edit, Mic, LibraryBooks, NavigateNext, AutoStories, AccessTime, EditNote } from '@mui/icons-material';
import { Card, CardContent, Typography, Stack, Tooltip, Hidden, IconButton, Box } from '@mui/material';
import Link from './common/Link';
import { useMemo } from 'react';
import { BookInfoDto, useBooksGetQuery } from '@/api/api';
import useAuthData from '@/hooks/useAuthData';
import { useTranslation } from 'react-i18next';
import useFormattedDateTime from '@/hooks/useFormattedDateTime';

interface BookCardProps {
  id: string;
  list?: boolean;
  info: BookInfoDto;
  updated?: string;
  authorsList: Record<string, string>;
  readersList: Record<string, string>;
  seriesList: Record<string, string>;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  list,
  info: { name, authors, readers, series, cover, draft },
  updated,
  authorsList,
  readersList,
  seriesList,
}) => {
  const { t } = useTranslation();
  const { data: books } = useBooksGetQuery();
  const { admin } = useAuthData() || {};

  const lastListenTime = useMemo(() => (updated ? new Date(updated) : undefined), [updated]);
  const lastListenFormattedTime = useFormattedDateTime(lastListenTime);

  const nextBooks = useMemo(() => {
    if (!books || list || series.length === 0) return [];
    const nextBooks = series.map(({ id, number }) =>
      books.find(
        book =>
          !!number &&
          book.info.series.some(series => series.id === id && series.number && +series.number === +number + 1)
      )
    );
    return nextBooks;
  }, [books, list, series]);

  return (
    <Card raised square>
      <Stack direction='row' flexGrow={1} alignContent='center'>
        <Hidden mdDown>
          {cover ? (
            <img alt={t('Cover image')} width={200} src={cover.filename} style={{ margin: 5, borderRadius: 5 }} />
          ) : (
            <AutoStories sx={{ width: 200, height: 200 }} color='primary' />
          )}
        </Hidden>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography variant='h6' sx={{ cursor: 'default' }} noWrap>
              {list ? <Link to={`/book/${id}`}>{name}</Link> : name}
            </Typography>
            {draft && <EditNote />}
            <Box flexGrow={1} />
            {admin && (
              <Tooltip title={t('Edit')}>
                <IconButton component={Link} to={`/edit/${id}`}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {authors.map(author_id => (
            <Stack direction='row' spacing={1} key={author_id}>
              <Tooltip title={t('Author')}>
                <Edit />
              </Tooltip>
              <Typography>
                <Link to={`/books?author_id=${author_id}`}>{authorsList[author_id] ?? author_id}</Link>
              </Typography>
            </Stack>
          ))}
          {readers.map(reader_id => (
            <Stack direction='row' spacing={1} key={reader_id}>
              <Tooltip title={t('Reader')}>
                <Mic />
              </Tooltip>
              <Typography>
                <Link to={`/books?reader_id=${reader_id}`}> {readersList[reader_id] ?? reader_id}</Link>
              </Typography>
            </Stack>
          ))}
          {series.map(({ id, number }, index) => (
            <Stack direction='row' spacing={1} key={id}>
              <Tooltip title={t('Series.one')}>
                <LibraryBooks />
              </Tooltip>
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
          {lastListenFormattedTime && (
            <Stack direction='row' spacing={1}>
              <Tooltip title={t('Last listen time')}>
                <AccessTime />
              </Tooltip>
              <Typography>{lastListenFormattedTime}</Typography>
            </Stack>
          )}
        </CardContent>
      </Stack>
    </Card>
  );
};

export default BookCard;
