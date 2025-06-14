import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/+esm';
import { transpose } from './transpose.js';

export class SlidesCanvas {
  app;
  background;
  slideIndexText;
  slides = [];
  chords = [];
  glyphWidth = 67 / 112;
  fontStyles = {};
  lineSpacing = 1 / 3;
  currentSlide = 0;
  fadeSpeed = 1 / 15;
  slideScale = 0.5;
  fontSize = 96;
  brightnessFilter;

  constructor(songData) {

    // Initialize the class
    this.app = new PIXI.Application({ background: '#232323', antialias: true, resizeTo: window });
    this.initFonts();
    this.initBackground("../img/bg1.jpg");
    this.initSlides(songData);
    this.initSlideIndexText();
    this.updateSlideRenderability();
    this.updateSlideScale();
    this.updateSlidePosition();
    this.initBrightnessFilter();
    this.setSlide(0);
    this.slides[0].alpha = 1;

    // Slide updates
    this.app.ticker.add((delta) => {
      this.updateSlideOpacity(delta);
      this.updateSlideRenderability();
      this.updateSlideScale();
      this.updateSlidePosition();
    })
  }

  setScale(scale) {
    scale = Math.min(Math.max(scale, 0.15), 3);
    this.slideScale = scale;
    this.updateSlideScale();
    this.updateSlidePosition();
  }

  updateSlideScale() {
    for (let slideIndex = 0; slideIndex < this.slides.length; slideIndex++) {
      const slide = this.slides[slideIndex];
      slide.scale.x = this.slideScale;
      slide.scale.y = this.slideScale;
    }
  }

  transpose(semitones) {
    for (let chordDisplay of this.chords) {
      let oldChord = chordDisplay.text.text;
      let newChord = transpose(oldChord, semitones);

      this.updateChord(chordDisplay, newChord);
    }
  }

  setSlide(slideIndex) {
    slideIndex = Math.min(Math.max(slideIndex, 0), this.slides.length);
    this.currentSlide = slideIndex;
    this.updateSlideRenderability();
    this.slideIndexText.text = `${slideIndex + 1}/${this.slides.length + 1}`;
  }

  initFonts() {
    this.fontStyles.lyrics = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: this.fontSize,
      fontStyle: 'normal',
      fontWeight: '400',
      fill: '#eeeeee'
    });

    this.fontStyles.chords = this.fontStyles.lyrics;
    
    this.fontStyles.hud = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '400',
      fill: '#aaaaaa'
    });
  }

  initSlides(songData) {
    for (let i = 0; i < songData.separators.length - 1; i++) {
      const lines = songData.lyrics.slice(songData.separators[i], songData.separators[i + 1])
      const slide = this.createSlide(lines);

      this.slides.push(slide);
      this.app.stage.addChild(slide);
    }
  }

  initBackground(bgUrl) {
    this.background = PIXI.Sprite.from(bgUrl);
    this.background.anchor.set(0.5);
    this.app.stage.addChild(this.background);

    const updateBackground = () => {
      const imageWidth = 3000;
      const imageHeight = 2000;
      const targetWidth = window.innerWidth;
      const targetHeight = window.innerHeight;
      const imageScale = Math.max(targetWidth / imageWidth, targetHeight / imageHeight);

      this.background.x = targetWidth / 2;
      this.background.y = targetHeight / 2;
      this.background.width = imageWidth * imageScale;
      this.background.height = imageHeight * imageScale;
    };

    window.addEventListener("resize", updateBackground);
    updateBackground();
  }

  initSlideIndexText() {
    this.slideIndexText = new PIXI.Text("", this.fontStyles.hud);
    this.slideIndexText.anchor.set(1);
    this.app.stage.addChild(this.slideIndexText);

    const updateTextPosition = () => {
      this.slideIndexText.position.x = window.innerWidth - 8;
      this.slideIndexText.position.y = window.innerHeight - 8;
    };

    updateTextPosition();
    window.addEventListener("resize", updateTextPosition);
  }

  updateChord(chord, chordText) {
    chord.text.text = chordText;

    chord.box.clear();
    chord.box.beginFill('#565656');
    chord.box.drawRoundedRect(-this.fontSize / 4, 0, (this.fontSize / 2) + (chordText.length * (this.glyphWidth * this.fontSize)), this.fontSize * (4 / 3), this.fontSize / 6);
    chord.box.endFill();
  }

  createChord(chordData) {
    const chordBox = new PIXI.Graphics();
    const chordText = new PIXI.Text(chordData.chord, this.fontStyles.chords);

    chordBox.beginFill('#565656');
    chordBox.drawRoundedRect(-this.fontSize / 4, 0, (this.fontSize / 2) + (chordData.chord.length * (this.glyphWidth * this.fontSize)), this.fontSize * (4 / 3), this.fontSize / 6);
    chordBox.endFill();

    chordText.position.y = this.fontSize / 12;

    this.chords.push({ box: chordBox, text: chordText });

    return [chordBox, chordText];
  }

  createChordOnSlide(chord, slide) {
    const container = new PIXI.Container();
    const [chordBox, chordText] = this.createChord(chord);

    container.addChild(chordBox);
    container.addChild(chordText);

    container.position.x = chord.index * (this.glyphWidth * this.fontSize);

    slide.addChild(container);

    return container;
  }

  createSlide(slideData) {
    const slide = new PIXI.Container();

    for (let lineIndex = 0; lineIndex < slideData.length; lineIndex++) {
      const lyrics = new PIXI.Text(slideData[lineIndex].lyrics, this.fontStyles.lyrics);

      lyrics.x = 0;
      lyrics.y = (lineIndex * (this.fontSize * (8 / 3))) + (this.fontSize * (4 / 3));
      slide.addChild(lyrics);

      for (let chord of slideData[lineIndex].chords) {
        const chordDisplay = this.createChordOnSlide(chord, slide);
        chordDisplay.position.y = lineIndex * (this.fontSize * (8 / 3));
      }
    }

    slide.cullable = true;
    slide.renderable = false;
    slide.alpha = 0;

    return slide;
  }

  updateSlideRenderability() {
    for (let slideIndex = 0; slideIndex < this.slides.length; slideIndex++) {
      const slide = this.slides[slideIndex];

      if (slide.opacity === 0) {
        slide.renderable = false;
      } else {
        slide.renderable = true;
      }
    }
  }

  updateSlideOpacity(delta) {
    for (let slideIndex = 0; slideIndex < this.slides.length; slideIndex++) {
      const slide = this.slides[slideIndex];
      let fadeSpeed = delta * this.fadeSpeed;

      if (slideIndex !== this.currentSlide) {
        fadeSpeed = -fadeSpeed;
      }

      slide.alpha += fadeSpeed;
      slide.alpha = Math.min(Math.max(slide.alpha, 0), 1)
    }
  }

  updateSlidePosition() {
    for (let slideIndex = 0; slideIndex < this.slides.length; slideIndex++) {
      const slide = this.slides[slideIndex];
      const slideX = (window.innerWidth - slide.width) / 2;
      const slideY = (window.innerHeight - slide.height) / 2;

      slide.position.x = slideX;
      slide.position.y = slideY;
    }
  }

  initBrightnessFilter(bgOnly=false) {
    this.brightnessFilter = new PIXI.ColorMatrixFilter();
    (bgOnly ? this.background : this.app.stage).filters = [this.brightnessFilter];
  }

  setBrightness(amt) {
    this.brightnessFilter.brightness(amt);
  }

  get canvas() {
    return this.app.view;
  }
}