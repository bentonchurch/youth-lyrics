import SwipeListener from 'https://cdn.jsdelivr.net/npm/swipe-listener@1.3.0/+esm'
import { SlidesCanvas } from './js/SlidesCanvas.js';
import { getCurrentSong } from './js/getCurrentSong.js';

// Create a new slides app and add it to the DOM
const song = getCurrentSong();
const slides = new SlidesCanvas(song);

document.body.appendChild(slides.canvas)

// Set the title of the window based off the song name and artis
document.title = `${song.meta.name} by ${song.meta.artist} | Benton Youth Lyrics`

// Create slide control functions
function nextSlide() {
  slides.setSlide(slides.currentSlide + 1);
}

function prevSlide() {
  slides.setSlide(slides.currentSlide - 1);
}

function transposeUp() {
  slides.transpose(1);
}

function transposeDown() {
  slides.transpose(-1);
}

// Control the slides based off screen swiping
SwipeListener(slides.canvas);

slides.canvas.addEventListener('swipe', (e) => {
  const directions = e.detail.directions;

  if (directions.right) {
    prevSlide();
  } else if (directions.left) {
    nextSlide();
  } else if (directions.top) {
    transposeUp();
  } else if (directions.bottom) {
    transposeDown();
  }
});

// Control the slides based off arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "ArrowLeft") {
    prevSlide();
  } else if (e.key === "ArrowUp") {
    transposeUp();
  } else if (e.key === "ArrowDown") {
    transposeDown();
  } else if (e.key === "=") {
    slides.setScale(slides.slideScale + 0.1)
  } else if (e.key === "-") {
    slides.setScale(slides.slideScale - 0.1)
  }
})