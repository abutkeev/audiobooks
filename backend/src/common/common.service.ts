import { Injectable, Logger } from '@nestjs/common';
import { copyFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import NodeID3 from 'node-id3';
import path from 'path';
import { DataDir } from 'src/constants';
import { v4 } from 'uuid';
import getMP3Duration from 'get-mp3-duration';

const logger = new Logger('CommonService');

@Injectable()
export class CommonService {
  readJSONFile(name: string): unknown {
    const filename = path.resolve(DataDir, name);
    if (!existsSync(filename)) {
      return undefined;
    }
    return JSON.parse(readFileSync(filename).toString());
  }

  writeJSONFile(name: string, data: unknown) {
    const filename = path.resolve(DataDir, name);
    if (existsSync(filename)) {
      copyFileSync(filename, `${filename}.bak`);
    }

    const tmpName = `${filename}.tmp`;
    writeFileSync(tmpName, JSON.stringify(data, null, 2));
    renameSync(tmpName, filename);
  }

  generateID() {
    return v4().toUpperCase();
  }

  getExtensionByMimeType(type: string) {
    switch (type) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
    }
    return undefined;
  }

  extractImageFromID3tag(file: string) {
    const tags = NodeID3.read(file);
    if (tags && tags.image && typeof tags.image === 'object') {
      const { mime: mimetype, imageBuffer: buffer } = tags.image;
      const extension = this.getExtensionByMimeType(mimetype);
      if (extension) {
        const originalname = `cover.${extension}`;
        return { originalname, mimetype, buffer };
      } else {
        logger.error(`unknown ${file} mime type ${mimetype}`);
      }
    }
    return undefined;
  }

  getDuration(filename: string) {
    const buffer = readFileSync(filename);
    return getMP3Duration(buffer) / 1000;
  }
}
