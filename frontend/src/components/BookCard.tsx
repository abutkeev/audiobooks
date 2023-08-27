import { Edit, Mic, LibraryBooks } from '@mui/icons-material';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import { BookInfo } from '../api/api';
import { Link } from 'react-router-dom';

interface BookCardProps {
  id?: string;
  info: BookInfo;
  authors: Record<string, string>;
  readers: Record<string, string>;
  series: Record<string, string>;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  info: { name, author_id, reader_id, series_id, series_number },
  authors,
  readers,
  series,
}) => (
  <Card sx={{ maxWidth: 'md', mx: 'auto' }}>
    <CardContent>
      <Typography variant='h6'>{id ? <Link to={`/book/${id}`}>{name}</Link> : name}</Typography>
      <Stack direction='row' spacing={1}>
        <Edit />
        <Typography>{authors[author_id] ?? author_id}</Typography>
      </Stack>
      <Stack direction='row' spacing={1}>
        <Mic />
        <Typography>{readers[reader_id] ?? reader_id}</Typography>
      </Stack>
      {series_id && (
        <Stack direction='row' spacing={1}>
          <LibraryBooks />
          <Typography>
            {series[series_id] ?? series_id} {series_number && `(${series_number})`}
          </Typography>
        </Stack>
      )}
    </CardContent>
  </Card>
);

export default BookCard;
