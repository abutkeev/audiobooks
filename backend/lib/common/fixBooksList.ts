import BookListEntry from '../../types/BookListEntry.intraface';

const fixBooksList = (input: any): BookListEntry[] => {
  if (!Array.isArray(input)) return [];
  return input.map(entry => {
    const newEntry: BookListEntry = {
      id: '',
      info: {
        name: '',
        author_id: '',
        reader_id: '',
      },
    };
    if ('id' in entry && typeof entry.id === 'string') {
      newEntry.id = entry.id;
    }
    if (!('info' in entry) || typeof entry.info !== 'object') return newEntry;
    const { info } = entry;
    if ('name' in info && typeof info.name === 'string') {
      newEntry.info.name = info.name;
    }
    if ('author_id' in info && typeof info.author_id === 'string') {
      newEntry.info.author_id = info.author_id;
    }
    if ('reader_id' in info && typeof info.reader_id === 'string') {
      newEntry.info.reader_id = info.reader_id;
    }
    if ('series_id' in info && typeof info.series_id === 'string') {
      newEntry.info.series_id = info.series_id;
    }
    if ('series_number' in info && typeof info.series_number === 'string') {
      newEntry.info.series_number = info.series_number;
    }
    if (
      'cover' in info &&
      typeof info.cover === 'object' &&
      info.cover &&
      'type' in info.cover &&
      typeof info.cover.type === 'string' &&
      'filename' in info.cover &&
      typeof info.cover.filename === 'string'
    ) {
      newEntry.info.cover = info.cover;
    }
    return newEntry;
  });
};

export default fixBooksList;
