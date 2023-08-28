import { readFileSync } from 'fs';
import path from 'path';

const readConfig = (dir: string, name: string) => {
  const filename = path.resolve(dir, name);
  try {
    return JSON.parse(readFileSync(filename).toString());
  } catch (e) {
    console.error(`Can't parse ${filename}`, e);
  }
};

export default readConfig;
