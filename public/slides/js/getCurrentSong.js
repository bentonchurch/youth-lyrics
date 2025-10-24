export function getCurrentSong() {
  const songList = JSON.parse(localStorage.songs);
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  const songIndex = Number(urlParameters.get("i"));
  const songData = songList[songIndex];

  return songData;
}

export function getChordSettings() {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  const showChords = urlParameters.get("chords") === 'false' ? false : true;

  return showChords;
}

export function getBrightness() {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  let brightnessString = urlParameters.get("b");
  let brightness = 1;

  if (brightnessString) {
    brightness = Number(brightnessString);
  }

  return brightness;
}
