import { TabManager } from "./TabManager.js";

/**
 * A loaded tab handler
 */
export class Tab {
  content;
  meta;
  separators;
  url;
  id;
  name;
  artist;
  uploader;
  createdDate;

  /**
   * Creates a new tab from a tab configuration object
   * @param {object} config The tab configuration object
   */
  constructor(config) {
    this.content = config.content;
    this.meta = config.meta;
    this.separators = config.separators;

    this.url = config.url;
    this.id = config.id;
    this.name = config.name;
    this.artist = config.artist;
    this.uploader = config.uploader;
    this.createdDate = config.createdDate;
  }

  /**
   * Saves the tab to the database
   */
  save() {
    TabManager.save(this);
  }

  /**
   * Generates a configuration object for this tab
   * @returns The tab's configuration object
   */
  toConfig() {
    return {
      content: this.content,
      url: this.url,
      id: this.id,
      name: this.name,
      artist: this.artist,
      uploader: this.uploader,
      createdDate: this.createdDate,
      separators: this.separators,
      version: 1
    }
  }
}