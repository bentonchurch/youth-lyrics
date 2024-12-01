export class TabEditor {
  tab;
  element;

  constructor(tab, element) {
    this.tab = tab;
    this.element = element;
    this.element.classList.add("tab-editor");

    this.render();
  }

  merge(index) {
    const separators = this.tab.separators;
    this.tab.separators = [...separators.slice(0, separators.indexOf(index)), ...separators.slice(separators.indexOf(index) + 1)];
    
    this.render();
  }

  split(index) {
    this.tab.separators.push(index);
    this.tab.separators =
      [...new Set(this.tab.separators)]
      .map(e => Number(e))
      .sort((a, b) => a - b);

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
    let elements = [];
    let groupCount = 0;

    for (const section of sections) {
      elements.push(this.generateSectionElement(section, groupCount));
      groupCount += section.length;
      elements.push(this.generateSectionMerger(groupCount));
    }

    elements.pop();

    this.element.innerHTML = "";
    this.element.append(...elements);
  }

  generateSectionElement(groups, groupsBefore) {
    const container = document.createElement("div");
    const sidebarElement = this.generateSectionSidebar();
    const groupsElement = document.createElement("div");

    container.classList.add("section");
    groupsElement.classList.add("section-content");

    for (const group in groups) {
      groupsElement.appendChild(this.generateGroupElement(groups[group]));

      if (group < groups.length - 1) {
        groupsElement.appendChild(this.generateSectionSplitter(Number(group) + 1 + groupsBefore));
      }
    }

    container.append(sidebarElement, groupsElement);

    return container;
  }

  generateSectionSidebar() {
    const container = document.createElement("div");
    const slider = document.createElement("span");
    const deleteButton = document.createElement("span");
    const cloneButton = document.createElement("span");

    container.classList.add("sidebar");
    slider.classList.add("material-icons-round");
    deleteButton.classList.add("material-icons-round", "button");
    cloneButton.classList.add("material-icons-round", "button");

    slider.innerText = "drag_handle";
    deleteButton.innerText = "close";
    cloneButton.innerText = "copy";

    container.append(slider, deleteButton, cloneButton);
    return container;
  }

  generateSectionSplitter(index) {
    const element = document.createElement("div");
    element.innerHTML = '<hr><span class="material-icons-round">content_cut</span><hr>';
    element.classList.add("section-splitter");
    element.addEventListener("click", () => {
      this.split(index);
    })

    return element;
  }

  generateSectionMerger(index) {
    const element = document.createElement("div");
    element.innerHTML = '<hr><span class="material-icons-round">arrow_upward</span><hr>';
    element.classList.add("section-splitter", "section-merger");
    element.addEventListener("click", () => {
      this.merge(index);
    })

    return element;
  }

  generateGroupElement(lines) {
    const container = document.createElement("div");

    container.classList.add("group");

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