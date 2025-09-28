import { settings } from './settings.js';
import { UltimateGuitarLoader } from './Loader.js';

/**
 * A utility class that simplifies the process of searching for tabs on Ultimate Guitar
 * @example
 * const search = await UltimateGuitarSearch.search("Numa Numa");
 */
class UltimateGuitarSearch {
  /**
   * Generates an Ultimate Guitar search url for a set of given filters
   * @param {string} query The actual search query (e.g., Numa Numa)
   * @param {string} searchType The type of content you're seaching for (title, band, news, reviews, lessons, users, backing_track)
   * @param {number} page The page to collect results for
   * @returns {string} A Ultimate Guitar search url
   */
  static generateSearchUrl(query, searchType, page) {
    searchType = encodeURIComponent(searchType);
    query = encodeURIComponent(query);

    return `https://www.ultimate-guitar.com/search.php?search_type=${searchType}&page=${page}&value=${query}`;
  }

  /**
   * Gets the search data for a given search
   * @param {string} query The actual search query (e.g., Numa Numa)
   * @param {string} [searchType] The type of content you're seaching for (title, band, news, reviews, lessons, users, backing_track).  Default is "title".
   * @param {number} [page] The page to collect results for.  Default is 1.
   * @async
   */
  static async loadSearchData(query, searchType="title", page=1) {
    return await UltimateGuitarLoader.load(this.generateSearchUrl(query, searchType, page));
  }

  /**
   * Takes a raw search result and converts it into a simplified, usable search result object
   * @param {object} result The raw search result object
   * @returns {object} A formatted search result object
   */
  static formatSearchResult(result) {
    return {
      title: `${result.song_name}${result.recording.is_acoustic ? ' Acoustic' : ''}${result.part ? ` ${result.part}` : ''}${result.recording.performance ? ' Live' : ''}${result.version > 1 ? ` (ver ${result.version})` : ''}`,
      subtitle: result.artist_name,
      url: result?.tab_url,
      tabId: result?.id,
      tabName: result?.song_name,
      artist: result?.artist_name,
      artistUrl: result?.artist_url
    };
  }

  /**
   * Generates a list of Ultimate Guitar tabs that match a given query
   * @param {string} query The search query (e.g., Numa Numa)
   * @returns {Array.<object>} The search results
   * @async
   */
  static async search(query) {
    const searchResults = (await this.loadSearchData(query)).results;
    const freeResults = searchResults.filter(e => e?.tab_access_type === 'public');
    const formattedResults = freeResults.map(e => this.formatSearchResult(e));

    return formattedResults;
  }
}

export { UltimateGuitarSearch };
