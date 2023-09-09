import NodeID3 from 'node-id3';
import readBookInfo from '../lib/common/readBookInfo';
import path from 'path';
import { copyFileSync, existsSync, writeFileSync } from 'fs';
import updateBookInfo from '../lib/common/updateBookInfo';
import updateMetadata from '../lib/common/updateMetadata';
import getExtensionByMimeType from '../lib/common/getExtensionByMimeType';
import readConfig from '../lib/common/readConfig';
import fixBooksList from '../lib/common/fixBooksList';
import extractBookCover from '../lib/common/extractBookCover';

if (process.argv.length < 3) {
  console.error(`Usage: npm run extract_cover <target dir>`);
  process.exit(1);
}
const targetDir = process.argv[2];
const books = fixBooksList(readConfig(targetDir, 'books.json'));

for (const {
  id,
  info: { cover },
} of books) {
  if (cover) continue;
  if (extractBookCover(targetDir, id)) {
    console.log(`cover extracted for ${id}`);
  } else {
    console.log(`cover not extracted for ${id}`);
  }
}

updateMetadata(targetDir);
