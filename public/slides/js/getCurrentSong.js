export function getCurrentSong() {
  const songList = JSON.parse(localStorage.songs);
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  const songIndex = Number(urlParameters.get("i"));
  const songData = songList[songIndex];

  return songData;
}