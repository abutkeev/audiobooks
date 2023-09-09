const regexp = /Playerjs\(({.+})\)/;
const extractPlayerJsPlaylist = async (url: string, data: string) => {
  const match = regexp.exec(data);
  if (!match) return null;
  const options = eval(`Object(${match[1]})`);
  if (!options && !('file' in options)) return null;
  const response = await fetch(new URL(options.file, url));
  if (!response.ok) return null;
  const result = JSON.parse(await response.text());
  if (!Array.isArray(result)) return null;
  const playlist = [];
  for (const item of result) {
    if (!('title' in item) || !('file' in item)) continue;
    playlist.push({ title: String(item.title), url: new URL(item.file, url).toString() });
  }
  if (playlist.length === 0) return null;
  return playlist;
};

export default extractPlayerJsPlaylist;
