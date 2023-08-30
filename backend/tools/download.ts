import { mkdirSync } from 'fs';
import extractPlaylist from '../lib/extractPlaylist';
import savePlaylist from '../lib/savePlaylist';
import path from 'path';
import generateID from '../lib/common/generateID';

if (process.argv.length < 4) {
  console.error(`Usage: npm run download <URL> <target dir>`);
  process.exit(1);
}

const url = process.argv[2];
const targetDir = process.argv[3];
extractPlaylist(url).then(playlist => {
  if (!playlist) throw new Error("Can't get playlist");
  const bookId = generateID();
  const bookDir = path.resolve(targetDir, 'books', bookId);
  mkdirSync(bookDir);
  savePlaylist(playlist, bookDir);
  console.log(`Book saved to ${bookDir}`)
});
