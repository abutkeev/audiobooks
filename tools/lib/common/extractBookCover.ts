import path from 'path';
import readBookInfo from './readBookInfo';
import { existsSync, copyFileSync, writeFileSync } from 'fs';
import NodeID3 from 'node-id3';
import getExtensionByMimeType from './getExtensionByMimeType';
import updateBookInfo from './updateBookInfo';

const extractBookCover = (targetDir: string, bookId: string) => {
  const bookInfo = readBookInfo(targetDir, bookId);
  for (const { filename } of bookInfo.chapters) {
    const bookDir = path.resolve(targetDir, 'books', bookId);
    const sourceFile = path.resolve(bookDir, filename);
    const tags = NodeID3.read(sourceFile);
    if (tags && tags.image && typeof tags.image === 'object') {
      const { mime: type, imageBuffer } = tags.image;
      const extension = getExtensionByMimeType(type);
      if (extension) {
        const filename = `cover.${extension}`;
        const coverPath = path.resolve(bookDir, filename);
        if (existsSync(coverPath)) {
          copyFileSync(coverPath, `${coverPath}.bak`);
        }
        writeFileSync(coverPath, imageBuffer);
        bookInfo.cover = { filename, type };
        updateBookInfo(targetDir, bookId, bookInfo);
        return true;
      } else {
        console.log(`unknown ${filename} mime type ${type}, skipped`);
      }
    }
  }
  return false;
};

export default extractBookCover;
