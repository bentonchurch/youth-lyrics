import { formatDate } from "../../../util/formatDate.js";

export class TableRow {
  container;
  tab;

  constructor(tab) {
    this.tab = tab;
    this.initializeContainer();

    const tabSize = (tab.byteCount / 1024).toFixed(1);

    this.addCell(`${tab.id}`);
    this.addCell(`<a href="${tab.url}" target="blank">${tab.name}</a>`);
    this.addCell(`<a href="${tab.artistUrl}" target="blank">${tab.artist}</a>`);
    this.addCell(`<a href="${tab.uploaderUrl}" target="blank">${tab.uploader}</a>`);
    this.addCell(`${formatDate(new Date(tab.createdDate))}`)
    this.addCell(`${tabSize} KB`)
  }

  initializeContainer() {
    this.container = document.createElement("tr");
  }

  addCell(html) {
    const cell = document.createElement("td");
    cell.innerHTML = html;
    this.container.append(cell);
  }
}
