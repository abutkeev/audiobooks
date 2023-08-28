import path from 'path';
import readConfig from './readConfig';

const readBookInfo = (dir: string, id: string) => readConfig(dir, path.resolve(dir, 'books', id, 'info.json'));

export default readBookInfo;
