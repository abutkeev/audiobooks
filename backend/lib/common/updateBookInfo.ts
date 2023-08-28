import path from 'path';
import BookInfo from '../../types/BookInfo.interface';
import readBookInfo from './readBookInfo';
import writeConfig from './writeConfig';

const updateBookInfo = (dir: string, id: string, info: BookInfo) => {
  const data = readBookInfo(dir, id);
  data.info = info;
  writeConfig(dir, path.resolve(dir, 'books', id, 'info.json'), data);
};

export default updateBookInfo;
