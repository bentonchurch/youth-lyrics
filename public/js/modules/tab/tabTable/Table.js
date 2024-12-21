import { TabManager } from "../TabManager.js";
import { TableRow } from "./TableRow.js";
import { TableHead } from "./TableHead.js";

export class Table {
  container;
  rows = [];
  table;
  head;

  constructor() {
    this.container = document.createElement("div");
    this.table = document.createElement("table");
    this.container.append(this.table);
    this.head = new TableHead();
    this.table.append(this.head.container);

    this.container.classList.add("tab-table");

    const tabs = TabManager.getAll();

    for (const tab in tabs) {
      this.addTab(tabs[tab]);
    }

    console.log(tabs);
  }

  addTab(tab) {
    const row = new TableRow(tab);
    this.rows.push(row);
    this.table.append(row.container);
  }
}
