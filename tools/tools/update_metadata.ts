import updateMetadata from '../lib/common/updateMetadata';

if (process.argv.length < 3) {
  console.error(`Usage: npm run update_metadata <target dir>`);
  process.exit(1);
}
const targetDir = process.argv[2];
updateMetadata(targetDir);
