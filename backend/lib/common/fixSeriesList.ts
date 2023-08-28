import Series from '../../types/Series.interface';

const fixSeriesList = (input: any): Series[] => {
  if (!Array.isArray(input)) return [];
  return input.map(entry => {
    const newEntry: Series = {
      id: '',
      name: '',
      author_id: '',
      books: [],
    };
    if ('id' in entry && typeof entry.id === 'string') {
      newEntry.id = entry.id;
    }
    if ('name' in entry && typeof entry.name === 'string') {
      newEntry.name = entry.name;
    }
    if ('author_id' in entry && typeof entry.author_id === 'string') {
      newEntry.author_id = entry.author_id;
    }
    if ('books' in entry && Array.isArray(entry.books)) {
      for (const book of entry.books) {
        if (typeof book === 'string') {
          newEntry.books.push(book);
        }
      }
    }
    return newEntry;
  });
};

export default fixSeriesList;
