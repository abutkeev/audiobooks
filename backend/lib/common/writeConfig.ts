import { copyFileSync, existsSync, writeFileSync } from 'fs';
import path from 'path';

const writeConfig = (dir: string, name: string, data: any) => {
  const filename = path.resolve(dir, name);
  if (existsSync(filename)) {
    copyFileSync(filename, `${filename}.bak`);
  }
  writeFileSync(filename, JSON.stringify(data, null, 2));
};

export default writeConfig;
