import fixBooksList from "./fixBooksList";
import fixPersonsList from "./fixPersonsList";
import fixSeriesList from "./fixSeriesList";
import getFixedBooksFromFs from "./getFixedBooksFromFs";
import readConfig from "./readConfig";
import updateBookInfo from "./updateBookInfo";
import writeConfig from "./writeConfig";

const updateMetadata = (targetDir: string) => {
  const books = readConfig(targetDir, 'books.json') || [];
  const authors = readConfig(targetDir, 'authors.json') || [];
  const readers = readConfig(targetDir, 'readers.json') || [];
  const series = readConfig(targetDir, 'series.json') || [];

  const booksList = fixBooksList(books);
  const authorsList = fixPersonsList(authors);
  const readersList = fixPersonsList(readers);
  const seriesList = fixSeriesList(series);

  const booksFromFs = getFixedBooksFromFs(targetDir);

  for (const fsBook of booksFromFs) {
    const {
      id,
      info: { name, author_id, reader_id, series_id, series_number },
    } = fsBook;
    const book = booksList.find(book => book.id === id);
    if (!book) {
      booksList.push(fsBook);
      continue;
    }
    if (name && book.info.name !== name) {
      book.info.name = name;
    }
    if (author_id && book.info.author_id !== author_id) {
      book.info.author_id = author_id;
    }
    if (reader_id && book.info.reader_id !== reader_id) {
      book.info.reader_id = reader_id;
    }
    if (series_id && book.info.series_id !== series_id) {
      book.info.series_id = series_id;
    }
    if (series_number && book.info.series_number !== series_number) {
      book.info.series_number = series_number;
    }
  }

  for (const {
    id,
    info: { author_id, reader_id, series_id },
  } of booksList) {
    if (author_id && !authorsList.find(author => author.id === author_id)) {
      authorsList.push({ id: author_id, name: '' });
    }
    if (reader_id && !readersList.find(reader => reader_id === reader.id)) {
      readersList.push({ id: reader_id, name: '' });
    }
    if (!series_id) continue;
    const series = seriesList.find(series => series.id === series_id);
    if (!series) {
      seriesList.push({ id: series_id, author_id, name: '', books: [id] });
      continue;
    }
    if (!series.books.includes(id)) {
      series.books.push(id);
    }
  }

  for (const { id, author_id, books } of series) {
    if (author_id && !authorsList.find(author => author.id === author_id)) {
      authorsList.push({ id: author_id, name: '' });
    }

    for (const bookId of books) {
      const book = booksList.find(({ id }) => id === bookId);
      if (!book) continue;
      if (!book.info.series_id) {
        book.info.series_id = id;
      }
    }
  }

  writeConfig(targetDir, 'books.json', booksList);
  writeConfig(targetDir, 'authors.json', authorsList);
  writeConfig(targetDir, 'readers.json', readersList);
  writeConfig(targetDir, 'series.json', seriesList);
  for (const { id, info } of booksList) {
    updateBookInfo(targetDir, id, info);
  }
};

export default updateMetadata;
