import extractPlayerJsPlaylist from './extractPlayerJsPlaylist';

const extractPlaylist = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Bad result ${response.status} ${response.statusText}`);
  }
  const result = await response.text();

  const playerJsPlaylist = await extractPlayerJsPlaylist(url, result);
  if (playerJsPlaylist) {
    return playerJsPlaylist;
  }
  throw new Error("Can't find playlist");
};

export default extractPlaylist;
