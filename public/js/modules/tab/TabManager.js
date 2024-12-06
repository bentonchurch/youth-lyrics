import { Tab } from './Tab.js';
import { TabLoader } from './TabLoader.js';

/**
 * A utility class to manage loading and and saving tabs
 * @example
 * TabManager.loadFromUrl(tabUrl);
 * TabManager.save(tab);
 * TabManager.getAll();
 * TabManager.get(tabId);
 */
export class TabManager {
  /**
   * Loads a tab from an Ultimate Guitar url
   * @param {string} url The Ultimate Guitar url
   * @returns The tab from the url
   */
  static async loadFromUrl(url) {
    const tabConfig = await TabLoader.loadTab(url);
    const tab = new Tab(tabConfig);
    return tab;
  }

  /**
   * Gets the currently saved tab configuration objects
   * @returns The currently saved tab configuration objects
   */
  static getTabConfigurations() {
    if (!localStorage.getItem("tabs")) {
      localStorage.setItem("tabs", "{}")
    }

    return JSON.parse(localStorage.getItem("tabs"));
  }

  /**
   * Gets all of the currently saved tabs
   * @returns All of the currently saved tabs
   */
  static getAll() {
    const tabs = this.getTabConfigurations();

    for (const tabConfigIndex in tabs) {
      tabs[tabConfigIndex] = new Tab(tabs[tabConfigIndex]);
    }

    return tabs;
  }

  /**
   * Gets a tab from the database using an Ultimate Guitar tab id
   * @param {number} id An Ultimate Guitar tab id
   * @returns The specified tab from the database
   */
  static get(id) {
    const tabs = this.getTabConfigurations();

    if (tabs[id]) {
      return new Tab(tabs[id]);
    }

    return undefined;
  }

  /**
   * Takes a tab and records it in the database using an Ultimate Guitar tab id
   * @param {number} id The tab id
   * @param {Tab} tab The tab
   */
  static set(id, tab) {
    const tabs = this.getTabConfigurations();
    tabs[id] = tab.toConfig();
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }

  /**
   * Takes a tab and saves it to the database (and overwrites the old tab data)
   * @param {Tab} tab The tab to save
   */
  static save(tab) {
    this.set(tab.id, tab);
  }
}
