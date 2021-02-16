let canvasX = 300;
let canvasY = 300;
let ballSpeed;
let slider;
var currColor;
var MAX_NUM = 30;
var circles = [];

let polySynth;
let notes = ['G4','F4','E4','D4','C4'];
let noteArrLen = 5;
let dur = 0.5; //duration
let time = 0; //delay
let vel = 1; //volume

function setup() {
  frameRate(120);
  let cnv = createCanvas(canvasX, canvasY);
  background(255);
  
  slider = createSlider(0, 10, 5);
  slider.position(10, 310);
  slider.style('width', '100px');

  polySynth = new p5.PolySynth();
}

function draw() {
  background(255);
  fill('black');
  square(25, 25, 250);
  ballSpeed = slider.value();

  for (var i = 0; i < circles.length; i++) {
    circles[i].move();
    circles[i].display();
  }

}

function mousePressed() {
  if ((circles.length < MAX_NUM) && (mouseIsInBounds())) {
    circles.push(new Ball());
  }

  //return false; //prevents browser-specific extra behaviors
}

function keyPressed() {
  if (keyCode == '32') { //spacebar
  circles = [];
  }
}

function playSynth() {
  userStartAudio();

  polySynth.play('C4', vel, 0, dur);
  polySynth.play('G4', vel, 0, dur);
}

function mouseIsInBounds() {
  return ((mouseX >= 0) && (mouseY >= 0 ) && (mouseX < canvasX) && (mouseY < canvasY));
}

function valToNotes(rawVal) {
  return notes[floor((rawVal / canvasX) * noteArrLen)];
}

function halvedValTo8Bit(rawVal) {
  if (rawVal <= (canvasX / 2)) {
    return (((rawVal * 2) / canvasX) * 255);
  } else {
    return ((2 - (rawVal / (canvasX / 2))) * 255);
  }
}

class Ball {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.going = 'R';
    this.color = color(halvedValTo8Bit(this.x), 0, 0);
  }

  move() {
    switch (this.going) {
      case 'R':
        if (this.x >= 295) {
          this.going = 'L';
          polySynth.play(valToNotes(this.y), 1, 0, 0.5);
          time = 0;
          break;
        }
        this.x += ballSpeed;
        this.color = color(0, 0, halvedValTo8Bit(this.x));
        break;

      case 'L':
        if (this.x <= 5) {
          this.going = 'R';
          polySynth.play(valToNotes(this.y), 1, 0, 0.5);
          break;
        }
        this.x -= ballSpeed;
        this.color = color(halvedValTo8Bit(this.x), 0, 0);
        break;

      default:
        this.going = 'R';
    }

  }

  display() {
    let size = 10 + (abs(((canvasX / 2) - this.x) / 10));
    let width = 10;
    if (this.going == 'L') {
      size = 35 - (abs(((canvasX / 2) - this.x) / 10));
    }
    fill(this.color);
    ellipse(this.x, this.y, size);
  }
}