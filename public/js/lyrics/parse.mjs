/*
  @todo: add more documentation to parsing process
*/

// Import a library to decode html entities
import { decode as decodeHTMLEntities } from "html-entities";

// Parse lyrics function
function parseLyrics(data) {
  // Get the page json data, and get only the part of it that is useful to us
  let songData = JSON.parse(
    // Parse JSON
    decodeHTMLEntities(
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

    let chordData = [];

    while (chord.indexOf("[ch]") !== -1) {
      let chordPos = chord.indexOf("[ch]");
      let chordText = chord.split("[ch]")[1].split("[/ch]")[0];
      chord = chord.replace("[ch]", "");
      chord = chord.replace("[/ch]", "");
      chordData.push({ chord: chordText, index: chordPos });
    }

    unparsedBody = unparsedBody.replace("[tab]", "");
    unparsedBody = unparsedBody.replace("[/tab]", "");

    lyrics.push({ chords: chordData, lyrics: lyric });
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
  };

  // Return the song data object
  return song;
}

// Export this function
export default parseLyrics;
