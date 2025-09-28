import { UltimateGuitarImporter } from "./Importer.js";
import { UltimateGuitarSearch } from "./Search.js";

class UltimateGuitar {
  urlPattern = /https:\/\/tabs\.ultimate-guitar\.com\/tab\/.*\/[^0-9]*[0-9]+/gm;

  static async search(query) {
    return await UltimateGuitarSearch.search(query);
  }

  static async load(url) {
    return await UltimateGuitarImporter.load(url);
  }
  
  static isUrlValid(url) {
    return this.urlPattern.test(url);
  }
}

export { UltimateGuitar };
