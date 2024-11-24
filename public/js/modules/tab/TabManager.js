import { Tab } from './Tab.js';
import { TabLoader } from './TabLoader.js';

export class TabManager {
  static async loadFromUrl(url) {
    const tabConfig = await TabLoader.loadTab(url);
    const tab = new Tab(tabConfig);
    return tab;
  }

  static get database() {
    if (!localStorage.getItem("tabs")) {
      localStorage.setItem("tabs", "{}")
    }

    return localStorage.getItem("tabs");
  }

  static saveToDatabase(tab) {
    const tabData = tab.toConfig();
    console.log(tabData, this.database);
  }

  static loadFromDatabase(tabId) {
    
  }
}

const tab = await TabManager.loadFromUrl("https://tabs.ultimate-guitar.com/tab/leonard-jones/bless-the-lord-chords-1409690");

TabManager.saveToDatabase(tab);