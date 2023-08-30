import { mkdirSync, writeFileSync } from 'fs';
import extractPlaylist from './extractPlaylist';
import path from 'path';
import BookInfo from '../types/BookInfo.interface';

const savePlaylist = async (playlist: Awaited<ReturnType<typeof extractPlaylist>>, targetDir: string) => {
  mkdirSync(targetDir, { recursive: true });
  const chapters = [];
  let i = 0;
  for (const { title, url } of playlist) {
    console.log(`saving ${title}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`can't save ${title}: ${response.status}, ${response.statusText}`);
    const filename = (playlist.length > 10 && i < 10 ? '0' + i : String(i)) + '.mp3';
    writeFileSync(path.resolve(targetDir, `${filename}`), new DataView(await response.arrayBuffer()));
    chapters.push({ title, filename });
    i++;
  }
  const info: BookInfo = {
    name: '',
    author_id: '',
    reader_id: '',
  };
  writeFileSync(path.resolve(targetDir, 'info.json'), JSON.stringify({ info, chapters }, null, 2));
};

export default savePlaylist;
