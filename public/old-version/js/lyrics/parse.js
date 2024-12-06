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
function parseLyrics(data) {
  // Get the page json data, and get only the part of it that is useful to us
  let songData = JSON.parse(
    // Parse JSON
    decode(
      // Remove all HTML entities
      data
        .split('<div class="js-store" data-content="')[1] // Remove everything before the json
        .split('"></div>')[0] // Remove everything after the json
    )
  ).store.page.data; // Get only the part of the object that contains relevant data

  // Parse the lyrics data
  let unparsedBody = songData.tab_view.wiki_tab.content; // Get the unparsed lyrics
  let lyrics = []; // Variable for parsed lyrics

  while (unparsedBody.indexOf("[tab]") !== -1) {
    let line = unparsedBody
      .slice(unparsedBody.indexOf("[tab]") + 5)
      .split("[/tab]")[0]
      .split("\r\n");

    let lyric = line[1];
    let chord = line[0];
    let chordParsed = line[0].split("[ch]").join("").split("[/ch]").join("");

    let chordData = [];

    while (chord.indexOf("[ch]") !== -1) {
      let chordPos = chord.indexOf("[ch]");
      let chordText = chord.split("[ch]")[1].split("[/ch]")[0];
      chord = chord.replace("[ch]", "");
      chord = chord.replace("[/ch]", "");
      chordData.push({ chord: chordText, index: chordPos });
    }
    //&nbsp;
    let htmlChords = line[0].split(' ').join('&nbsp;').split('[ch]').join('<span class="c">').split('[/ch]').join('</span>');

    for (let i = 0; i < htmlChords.split('<span class="c">').length; i++) {
      let index = getPosition(htmlChords, '<span class="c">', i);
      let chord = htmlChords.slice(index + 16);
      chord = chord.slice(0, chord.indexOf('</span>'));
      let whiteChord = "&nbsp;".repeat(chord.length);
      htmlChords = htmlChords.slice(0, index + 23 + chord.length) + whiteChord + htmlChords.slice(index + 23 + chord.length);
    }

    unparsedBody = unparsedBody.replace("[tab]", "");
    unparsedBody = unparsedBody.replace("[/tab]", "");

    lyrics.push({ chords: chordData, chordLyrics: chordParsed, lyrics: lyric, htmlChords: htmlChords });
  }

  let removedChars = unparsedBody
    .split(" ")
    .join("")
    .split("\r")
    .join("")
    .split(/\n{1,}/)
    .join("\n");
  let headerIndexes = [];

  for (let i = 1; i < removedChars.split("[").length; i++) {
    let index = getPosition(removedChars, "[", i);
    if (
      removedChars.slice(index).startsWith("[tab") ||
      removedChars.slice(index).startsWith("[/tab") ||
      removedChars.slice(index).startsWith("[ch") ||
      removedChars.slice(index).startsWith("[/ch")
    ) {
    } else {
      headerIndexes.push(index);
    }
  }
  headerIndexes.push(removedChars.length);
  headerIndexes.sort((a, b) => a - b);

  for (let i = 0; i < lyrics.length; i++) {
    let data = lyrics[i];
    let str = "";

    for (let j = 0; j < data.chords; j++) {
      str += data.chordLyrics.slice(str.length, data.chords[j].index);
      str += " ".repeat(data.chords[j].chord.length);
    }
    str += data.chordLyrics.slice(str.length, data.chordLyrics.length);
  }

  // Create an object containing all the important song data
  let song = {
    meta: {
      // Song meta data
      name: songData.tab.song_name, // Song name
      artist: songData.tab.artist_name, // Song artist name
      type: songData.tab.type, // Song type
      difficulty: songData.tab.difficulty, // Song difficulty
    },
    //content: songData.tab_view.wiki_tab.content, // Raw body (unused)
    //applicature: songData.tab_view.applicature,  // Applicature (unused)
    lyrics: lyrics, // Return the parsed lyrics and chords
    separators: [0, lyrics.length],
  };

  // Return the song data object
  return song;
}

export default parseLyrics;
