import { decode } from "https://cdn.jsdelivr.net/npm/html-entities@2.5.2/+esm";

/**
 * A utility class to provide a simplified interface for loading data from Ultimate Guitar urls.  Consider it an artificial API.
 * @example
 * const data = await UltimateGuitarLoader.load("https://ultimate-guitar.com");
 */
class UltimateGuitarLoader {
  static jsonStartMarker = '<div class="js-store" data-content="';
  static jsonEndMarker = '"></div>';

  /**
   * Generates a CORS Proxy url for any given url, to bypass CORS restrictions
   * @param {string} url The url to generate a CORS Proxy url for
   * @returns {string} The generated CORS Proxy url
   */
  static proxyUrl(url) {
    return `https://corsproxy.io/?url=${url}`;
  }

  /**
   * Loads raw HTML from a given url
   * @param {string} url The url to load raw HTML from
   * @returns {string} The raw HTML loaded from the url
   * @async
   */
  static async loadRawData(url) {
    return await (await fetch(this.proxyUrl(url))).text();
  }

  /**
   * Extracts the JSON content from the "data-content" attribute of the ".js-store" div
   * @param {string} rawData The raw HTML to extract the JSON data from
   * @returns {object} The full JSON object included in the HTML
   */
  static extractJsonData(rawData) {
    const rawJson = rawData.split(this.jsonStartMarker)[1].split(this.jsonEndMarker)[0];
    const parsedJson = JSON.parse(decode(rawJson));
    return parsedJson;
  }

  /**
   * Loads the page data for a given Ultimate Guitar url
   * @param {string} url The url to load data from
   * @returns {object} The data loaded from Ultimate Guitar
   * @async
   */
  static async load(url) {
    return this.extractJsonData(await this.loadRawData(url))?.store?.page?.data;
  }
}

export { UltimateGuitarLoader };
