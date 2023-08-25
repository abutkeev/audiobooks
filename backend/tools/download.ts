import extractPlaylist from '../lib/extractPlaylist';
import savePlaylist from '../lib/savePlaylist';

if (process.argv.length < 4) {
  console.error(`Usage: npm run download <URL> <target dir>`);
  process.exit(1);
}

const url = process.argv[2];
const targetDir = process.argv[3];
extractPlaylist(url).then(playlist => {
  if (!playlist) throw new Error("Can't get playlist");
  savePlaylist(playlist, targetDir);
});
