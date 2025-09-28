export function getCurrentSong() {
  const songList = JSON.parse(localStorage.songs);
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  const songIndex = Number(urlParameters.get("i"));
  const songData = songList[songIndex];

  return songData;
}

export function getBrightnessSettings() {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  let brightnessString = urlParameters.get("b");
  let bgOnly = false;
  let brightness = 1;

  if (brightnessString) {
    if (brightnessString.startsWith('t')) {
      bgOnly = true;
      brightnessString = brightnessString.slice(1);
    }

    brightness = Number(brightnessString);
  }

  return { bgOnly, brightness };
}
