/************************************************************************************************
 * 
 * This loader was somewhat complicated to put together, so I thought it would be helpful
 * to have an in depth explanation on how it works.  Here is the explanation:
 * 
 * 
 * 
 * 1. First, we get the tab data.  We'll start by sending a GET request to the tab url,
 *    which will give us the HTML document for the tab's page.  Inside this HTML
 *    document, there is a div element with the class "js-store" and an attribute
 *    called "data-content".  For reference, here's what it looks like:
 * 
 *    <div class="js-store" data-content="..."></div>
 * 
 *    The value of the data-content attribute contains an encoded JSON file with all
 *    of the information about the tab, as well as some extra information for the
 *    website and your current session.  In order to get the data, all we need to do is
 *    get the value of this attribute, decrypt the HTML entities, and then parse the
 *    JSON.
 * 
 * 
 * 
 * 2. Now that we have the tab data, we'll start off by generating a metadata object.
 *    The metadata for the song is being stored in "tabData.store.page.data.tab", and we
 *    want to grab the following pieces of information:
 * 
 *    - The tab's url (tab_url)
 *    - The tab's id (id)
 *    - The tab's name (song_name)
 *    - The artist's name (artist_name)
 *    - The uploader's username (username)
 * 
 *    Each piece of information is listed with their property name in the metadata
 *    object.  Additionally, we also include a creation date (createdDate).  We'll simply
 *    create a new metadata object with the above listed metadata properties.
 * 
 * 
 * 
 * 3. Next, we have to parse the tab's content.  The tab content is located in the
 *    tab data with the pointer "tabData.store.page.data.tab_view.wiki_tab.content".
 *    Inside this string, there are HTML like tags, except instead of using angle
 *    brackets (<tag>, </tag>), they use square brackets ([tag], [/tag]).  We start off
 *    by looking for "tab" tags ([tab], [/tab]).  The tab tag groups several lines of
 *    text together.  The lines themselves are separated from each other by the
 *    delimiter "\r\n".  First, we'll generate an array of every "tab" tag pair in the
 *    content.  (We make sure that the tab tags themselves aren't included.)  Then, we
 *    convert every element of this new array each into their own array by separating
 *    each line by their delimiter.  Finally, we take each line and parse the chords.
 *    The chords are marked with a "ch" tag.  The line ends up becoming an object with
 *    two properties; one called "text", which is the original line except the chords
 *    have been converted to whitespace, and "chords", which is an array of objects.
 *    Each chord object contains a position ("pos") and a chord value ("text").
 * 
 * 
 * 
 * 4. Finally, we generate one complete tab data object.  It will include the tab
 *    metadata (mentioned in step 2), where each property of the tab metadata will be
 *    appended to the tab data, and the tab content as the property "content".
 *    Additionally, we will add the property "version", which will indicate the format
 *    version of the object, and an empty array called "separators", which will
 *    eventually store markers where the content should be separated to show individual
 *    slides.
 * 
************************************************************************************************/

import { decode } from "https://cdn.jsdelivr.net/npm/html-entities@2.5.2/+esm";

/**
 * A utility class to load Ultimate Guitar tabs.
 * @example
 * const myTab = await TabLoader.loadTab(tabUrl);
 */
export class TabLoader {
  static jsonStartMarker = '<div class="js-store" data-content="';
  static jsonEndMarker = '"></div>';

  /**
   * Takes any url and converts it into a CORS Proxy url
   * @static
   * @param {string} url The url to convert
   * @returns A CORS Proxy url
   */
  static proxyUrl(url) {
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  }

  /**
   * Loads all of the data available for a tab
   * @static
   * @async
   * @param {string} tabUrl The tab url
   * @returns All of the available tab data
   */
  static async loadTabData(tabUrl) {
    const request = await fetch(this.proxyUrl(tabUrl));
    const requestData = await request.text();
    const jsonSection = requestData.split(this.jsonStartMarker)[1].split(this.jsonEndMarker)[0];
    const tabData = JSON.parse(decode(jsonSection));

    return tabData;
  }

  /**
   * Generates an object containing various pieces of tab metadata
   * @static
   * @param {object} tabData The full tab data object
   * @returns A simplified object containing various pieces of the tab metadata
   */
  static getTabMetadata(tabData) {
    return {
      url: tabData?.store?.page?.data?.tab?.tab_url,
      id: tabData?.store?.page?.data?.tab?.id,
      name: tabData?.store?.page?.data?.tab?.song_name,
      artist: tabData?.store?.page?.data?.tab?.artist_name,
      artistUrl: tabData?.store?.page?.data?.tab?.artist_url,
      uploader: tabData?.store?.page?.data?.tab?.username,
      uploaderUrl: 'https://www.ultimate-guitar.com/u/' + tabData?.store?.page?.data?.tab?.username,
      createdDate: Date.now()
    }
  }

  /**
   * Gets the tab content string from the full tab data object
   * @static
   * @param {object} tabData The full tab data object
   * @returns The tab content data string
   */
  static getTabContent(tabData) {
    return tabData?.store?.page?.data?.tab_view?.wiki_tab?.content;
  }

  /**
   * Takes any line from the Ultimate Guitar tab and separates the text and the chords
   * @static
   * @param {string} tabLine The line from the tab
   * @returns An object containing the tab text and chords
   */
  static parseTabLine(tabLine) {
    let lineText = tabLine;
    let lineChords = [];

    // Check for every chord in the line
    while (lineText.indexOf('[ch]') >= 0) {
      const chordPos = lineText.indexOf('[ch]');
      const chord = lineText.slice(chordPos, lineText.indexOf('[/ch]') + 5);
      const chordText = chord.slice(4, -5);

      // Replace the chord in the line text with whitespace
      lineText = lineText.slice(0, chordPos) + ' '.repeat(chord.length - 9) + lineText.slice(chordPos + chord.length);

      // Add the chord to the chord list
      lineChords.push({ pos: chordPos, text: chordText })
    }

    return { text: lineText, chords: lineChords };
  }

  /**
   * Takes the tab content string and parses it
   * @static
   * @param {string} tabContent The tab content string
   * @returns An array containing the parsed chord data
   */
  static parseTabContent(tabContent) {
    const tabs = tabContent
      .match(/\[tab\].*?\[\/tab\]/gms)
      .map(e => e.slice(5, -6));

    for (let tab in tabs) {
      tabs[tab] = tabs[tab].split('\r\n').map(e => this.parseTabLine(e));
    }

    return tabs;
  }

  /**
   * Loads a formatted tab data object from an Ultimate Guitar tab url
   * @static
   * @async
   * @param {string} tabUrl The Ultimate Guitar tab url
   * @returns A formatted tab data object with all of the needed tab data
   */
  static async loadTab(tabUrl) {
    const tabData = await this.loadTabData(tabUrl);
    const tabMeta = this.getTabMetadata(tabData);
    const tabContent = this.getTabContent(tabData);
    const tabContentParsed = this.parseTabContent(tabContent);

    return {
      ...tabMeta,
      content: tabContentParsed,
      separators: [],
      version: 1
    };
  }
}
