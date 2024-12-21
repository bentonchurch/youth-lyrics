export class TableHead {
  container;

  constructor() {
    this.container = document.createElement("thead");

    this.addCell('ID');
    this.addCell('Name');
    this.addCell('Artist');
    this.addCell('Uploader');
    this.addCell('Date');
    this.addCell('Size');
  }

  addCell(html) {
    const cell = document.createElement("td");
    cell.innerHTML = html;
    this.container.append(cell);
  }
}