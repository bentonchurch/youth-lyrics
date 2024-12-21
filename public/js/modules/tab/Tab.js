import { TabManager } from "./TabManager.js";
import { Transposer } from "./Transposer.js";

/**
 * A loaded tab handler
 */
export class Tab {
  content;
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
    this.separators = config.separators;
    this.url = config.url;
    this.id = config.id;
    this.name = config.name;
    this.artist = config.artist;
    this.artistUrl = config.artistUrl;
    this.uploader = config.uploader;
    this.uploaderUrl = config.uploaderUrl;
    this.createdDate = config.createdDate;
  }

  /**
   * Transposes the tab by a set number of semitones
   * @param {number} semitones The number of semitones to transpose by
   */
  transpose(semitones) {
    for (const section of this.content) {
      for (const line of section) {
        for (const chord of line.chords) {
          chord.text = Transposer.transpose(chord.text, semitones);
        }
      }
    }
  }

  /**
   * Gets the amount of bytes of storage the tab takes up.
   */
  get byteCount() {
    return JSON.stringify(this.toConfig()).length;
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
      artistUrl: this.artistUrl,
      uploader: this.uploader,
      uploaderUrl: this.uploaderUrl,
      createdDate: this.createdDate,
      separators: this.separators,
      version: 1
    }
  }
}
