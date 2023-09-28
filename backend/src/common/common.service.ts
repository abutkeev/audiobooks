import { Injectable, NotFoundException } from '@nestjs/common';
import { copyFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import path from 'path';
import { DataDir } from 'src/constants';
import { v4 } from 'uuid';

@Injectable()
export class CommonService {
  readJSONFile(name: string): unknown {
    const filename = path.resolve(DataDir, name);
    if (!existsSync(filename)) {
      throw new NotFoundException(`${filename} not found`);
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
}
