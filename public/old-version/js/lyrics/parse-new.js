/*
  @todo: add more documentation to parsing process
*/

import { decode } from "https://cdn.jsdelivr.net/npm/html-entities@2.5.2/+esm";

/*
function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}
*/
function getPosition(string, subString, index) {
  return string.split(subString).slice(0, index + 1).join(subString).length;
}

// Parse lyrics function
export function parseLyrics(data) {
  const jsonStartMarker = '<div class="js-store" data-content="'
  const jsonEndMarker = '"></div>'
  const jsonSection = data.split(jsonStartMarker)[1].split(jsonEndMarker)[0]
  const songJson = JSON.parse(decode(jsonSection));

  const songObjData = {
    proTabUrl: songJson?.store?.page?.data?.tab?.best_pro_tab_url,
    tabUrl: songJson?.store?.page?.data?.tab?.tab_url,
    songId: songJson?.store?.page?.data?.tab?.id,
    songName: songJson?.store?.page?.data?.tab?.song_name,
    artistName: songJson?.store?.page?.data?.tab?.artist_name,
    userName: songJson?.store?.page?.data?.tab?.username,
    ug_difficulty: songJson?.store?.page?.data?.tab_view?.ug_difficulty,
    difficulty: songJson?.store?.page?.data?.tab_view?.meta?.difficulty,
    tuning: songJson?.store?.page?.data?.tab_view?.meta?.tuning,
    applicature: songJson?.store?.page?.data?.tab_view?.applicature,
    tabContent: songJson?.store?.page?.data?.tab_view?.wiki_tab?.content
  }

  // Return the song data object
  return `<pre><code>${JSON.stringify(songObjData, null, 2)}</code></pre>`;
}
