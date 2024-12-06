import Hammer from 'https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/+esm'
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

const toggleFullscreen = () => 
    document.fullscreenElement ?
        document.exitFullscreen() :
        document.querySelector('body').requestFullscreen()

// Control pinching and swiping
const hammer = new Hammer(document, {})
hammer.get('pinch').set({ enable: true });
hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

let prevPinch = 1;

hammer.on("pinchstart", function(ev) {
  prevPinch = ev.scale;
});

hammer.on("pinch", function(ev) {
  const scaleAmount =  ((ev.scale - prevPinch) / 2) + slides.slideScale;
  slides.setScale(scaleAmount);
  prevPinch = ev.scale;
});

hammer.on("swiperight", function(ev) {
  prevSlide();
});

hammer.on("swipeleft", function(ev) {
  nextSlide();
});

hammer.on("swipeup", function(ev) {
  transposeUp();
});

hammer.on("swipedown", function(ev) {
  transposeDown();
});

hammer.on("tap", function(ev) {
  if (ev.tapCount === 2) {
    toggleFullscreen();
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