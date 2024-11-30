export class TabEditor {
  tab;
  element;

  constructor(tab, element) {
    this.tab = tab;
    this.element = element;
    this.element.classList.add("tab-editor");
    
    this.render();
  }

  getSections() {
    const sectionCount = this.tab.separators.length + 1;
    let sections = [];

    for (let i = 0; i < sectionCount; i++) {
      sections.push(this.getSection(i));
    }

    return sections;
  }

  getSection(index) {
    const separators = [0, ...this.tab.separators, this.tab.content.length];
    const dataStart = separators[index];
    const dataEnd = separators[index + 1];
    const sectionData = this.tab.content.slice(dataStart, dataEnd);

    return sectionData;
  }

  render() {
    const sections = this.getSections();
    const elements = sections.map(e => this.generateSectionElement(e))

    this.element.innerHTML = "";
    this.element.append(...elements);
  }

  generateSectionElement(groups) {
    const container = document.createElement("div");

    for (const group of groups) {
      container.appendChild(this.generateGroupElement(group));
    }

    return container;
  }

  generateGroupElement(lines) {
    const container = document.createElement("div");

    for (const line of lines) {
      container.appendChild(this.generateLineElement(line));
    }

    return container;
  }

  /**
   * Generates a paragraph element with line text and chords
   * @param {object} data A tab line content object
   * @returns An HTML element with the line
   */
  generateLineElement(data) {
    const container = document.createElement("p");
    let text = data.text;
    let chords = data.chords;

    // Insert the chords into the text
    for (let i = chords.length - 1; i >= 0; i--) {
      let chord = chords[i];
      text = text.slice(0, chord.pos) + '<span>' + chord.text + '</span>' + text.slice(chord.pos + chord.text.length, text.length);
    }

    text = text.replaceAll(' ', '&nbsp;');
    container.innerHTML = text;

    return container;
  }
}