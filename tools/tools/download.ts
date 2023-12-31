import { mkdirSync } from 'fs';
import extractPlaylist from '../lib/extractPlaylist';
import savePlaylist from '../lib/savePlaylist';
import path from 'path';
import generateID from '../lib/common/generateID';
import updateMetadata from '../lib/common/updateMetadata';

if (process.argv.length < 4) {
  console.error(`Usage: npm run download <target dir> <URL>`);
  process.exit(1);
}

const targetDir = process.argv[2];
const url = process.argv[3];
extractPlaylist(url).then(async playlist => {
  if (!playlist) throw new Error("Can't get playlist");
  const bookId = generateID();
  const bookDir = path.resolve(targetDir, 'books', bookId);
  mkdirSync(bookDir);
  await savePlaylist(playlist, bookDir);
  updateMetadata(targetDir);
  console.log(`Book saved to ${bookDir}`);
});
