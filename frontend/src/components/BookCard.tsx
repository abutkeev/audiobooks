import { Edit, Mic, LibraryBooks, NavigateNext, AutoStories, AccessTime, EditNote } from '@mui/icons-material';
import { Card, CardContent, Typography, Stack, Tooltip, IconButton, Box } from '@mui/material';
import Link from './common/Link';
import { useMemo } from 'react';
import { BookInfoDto, useBooksGetQuery } from '@/api/api';
import useAuthData from '@/hooks/useAuthData';
import { useTranslation } from 'react-i18next';
import useFormattedDateTime from '@/hooks/useFormattedDateTime';

// the breakpoint matches useMobile, so the cover shrinks exactly where the layout does
const coverSize = { xs: 110, sm: 200 };

interface BookCardProps {
  id: string;
  list?: boolean;
  info: BookInfoDto;
  updated?: string;
  to?: string;
  authorsList: Record<string, string>;
  readersList: Record<string, string>;
  seriesList: Record<string, string>;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  list,
  info: { name, authors, readers, series, cover, draft },
  updated,
  to,
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
      <Stack direction='row' sx={{ flexGrow: 1 }}>
        <Box sx={{ flexShrink: 0, alignSelf: 'center', m: 0.5 }}>
          {cover ? (
            <Box
              component='img'
              alt={t('Cover image')}
              src={cover.filename}
              sx={{ display: 'block', width: coverSize, borderRadius: 1 }}
            />
          ) : (
            <AutoStories sx={{ width: coverSize, height: coverSize }} color='primary' />
          )}
        </Box>
        {/* minWidth lets the flex items shrink below their content, so a long title is
            truncated instead of pushing the edit button out of the screen */}
        <CardContent sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant='h6' sx={{ cursor: 'default', minWidth: 0 }} noWrap>
              {list ? <Link to={to ?? `/book/${id}`}>{name}</Link> : name}
            </Typography>
            {draft && <EditNote />}
            <Box sx={{ flexGrow: 1 }} />
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
