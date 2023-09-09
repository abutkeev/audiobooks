import { existsSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import BookListEntry from '../../types/BookListEntry.intraface';
import path from 'path';
import BookInfo from '../../types/BookInfo.interface';
import readBookInfo from './readBookInfo';
import fixBooksList from './fixBooksList';

const getFixedBooksFromFs = (dir: string): BookListEntry[] => {
  const booksDir = path.resolve(dir, 'books');
  if (!lstatSync(booksDir)?.isDirectory()) {
    mkdirSync(booksDir, { recursive: true });
    return [];
  }
  const entries: BookListEntry[] = [];
  const dirEntries = readdirSync(booksDir);
  for (const id of dirEntries) {
    if (!lstatSync(path.resolve(booksDir, id)).isDirectory()) continue;
    const infoFile = path.resolve(booksDir, id, 'info.json');
    const emptyBookInfo: BookInfo = { name: '', author_id: '', reader_id: '' };
    if (!existsSync(infoFile)) {
      const chapters = readdirSync(path.resolve(booksDir, id))
        .filter(name => /\.mp3$/.exec(name))
        .sort()
        .map(filename => ({ filename, title: filename.replace(/\.mp3$/, '') }));
      writeFileSync(infoFile, JSON.stringify({ info: emptyBookInfo, chapters }, null, 2));
      entries.push({ id, info: emptyBookInfo });
      continue;
    }
    const savedData = readBookInfo(dir, id);
    entries.push({ id, info: 'info' in savedData ? savedData.info : emptyBookInfo });
  }
  return fixBooksList(entries);
};

export default getFixedBooksFromFs;
