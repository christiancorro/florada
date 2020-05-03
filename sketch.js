let bgColor;
var nFlowers = 622;//1295;
var distortionTopPetals = 20; //distortion Top petal
var distortionLeftPetals = 10; //distortion
var distortionRightPetals = 10; //distortion
var distortionNPetals = 10;
var hueAngle = 55;
var distortionHueAngle = 10;
var S = 88;
var L = 61;
var minOpacity = .2;
var maxOpacity = .95;
var nPetals = 20;
var lineTreshold = 52;
let florada = new Array();
var minHue = 184;
var maxHue = 360;
var minRadius = .02;
var maxRadius = .12;
var strokeDimension = .7;
var strokeAlpha = .9;
let visible = true;
var createCenter = false;
var drawLines = true;
var colorful = true;
function setup() {
  createCanvas(880, windowHeight);

  //GUI

  guiColor = createGui('Color | [ t ] hide', 0, 160);
  gui = createGui('Morfology | [ t ] hide', windowWidth - 220, 160);
  // gui = createGui('Distortions', 220, 460);
  sliderRange(0, 1500, 1);
  gui.addGlobals('nFlowers');
  sliderRange(0, 360, 1);
  guiColor.addGlobals('minHue', 'maxHue', 'hueAngle', 'distortionHueAngle');
  sliderRange(0, 100, 1);
  guiColor.addGlobals('S', 'L');
  sliderRange(0, 1, 0.01);
  guiColor.addGlobals('minOpacity', 'maxOpacity');
  sliderRange(0, 10, 0.1);
  guiColor.addGlobals('strokeDimension');
  sliderRange(0, 1, 0.1);
  guiColor.addGlobals('strokeAlpha');
  guiColor.addGlobals('colorful');
  sliderRange(0, 300, 1);
  gui.addGlobals('nPetals', 'distortionNPetals');
  gui.addGlobals('createCenter');
  sliderRange(0, 500, 1);
  gui.addGlobals('distortionTopPetals', 'distortionLeftPetals', 'distortionRightPetals');
  sliderRange(0, 3, 0.01);
  gui.addGlobals('minRadius');
  sliderRange(0, 10, 0.01);
  gui.addGlobals('maxRadius');
  gui.addGlobals('drawLines');
  sliderRange(0, width, 1);
  gui.addGlobals('lineTreshold');
  //--end GUI

  colorMode(HSL, 360, 100, 100);
  bgColor = color(28, 82, 95);
  background(bgColor);
  addFlower();
  noLoop();
}



function draw() {
  background(bgColor);
  fill(0);
  textSize(26);
  text("Florada", 50, 100);
  textSize(13);
  text("John Maeda, 1990s", 50, 120);
  push();
  translate(220, 0);
  updateFlorada();
  pop();
}


function updateFlorada() {
  if (createCenter) {
    florada.length = 0;
    addFlower();
  }
  //control if change number of flowers
  if (florada.length > nFlowers) {
    florada.length = nFlowers;
  } else {
    addFlower();
  }
  florada.forEach(f => {
    f.update();
    f.show();
  });
  if (drawLines)
    createLines();
}

function addFlower() {
  for (let i = florada.length; i < nFlowers; i++) {

    let x;
    let y;
    if (!createCenter) {
      x = random(0, width - 250);
      y = random(80, height - 100);
    } else {
      x = width / 4;
      y = height / 2;
    }
    let radius = random(minRadius, maxRadius);
    let petalColor = round(random(minHue, maxHue));
    florada.push(new Flower(x, y, distort(nPetals, distortionNPetals), radius, petalColor));
    florada[i].show();
  }
}

function createLines() {
  for (let i = 0; i < florada.length; i++) {
    for (let j = 0; j < florada.length; j++) {
      strokeWeight(.1);
      stroke(0, .3);
      if (abs(florada[i].x - florada[j].x) < lineTreshold && abs(florada[i].y - florada[j].y) < lineTreshold)
        line(florada[i].x, florada[i].y, florada[j].x, florada[j].y);
    }
  }
}

class Flower {
  constructor(x, y, np, r, hue) {
    this.x = round(x);
    this.y = round(y);
    this.nPetals = round(np) >= 0 ? round(np) : 0;
    this.radius = round(r * 100) / 100;
    this.hue = hue;
    this.petals = new Array();
    this.addPetals();
  }

  addPetals() {
    let col;
    for (let i = 0; i < this.nPetals; i++) {
      col = color((this.hue + (i % 2 === 0 ? hueAngle : 0)) % 360, S, L, random(minOpacity, maxOpacity));
      this.petals.push(new Petal(this.x, this.y, this.radius, col));
      this.petals[i].randomize();
    }
  }

  show() {
    let sc = random(minRadius, maxRadius);
    for (let i = 0; i < this.nPetals; i++) {
      push();
      translate(this.x, this.y);
      scale(sc);
      rotate(random(1, i * 2));
      this.petals[i].show();
      pop();
    }

  }

  updatePetals() {
    for (let i = 0; i < this.petals.length; i++) {
      this.petals[i].c = color((this.hue + (i % 2 === 0 ? distort(hueAngle, distortionHueAngle) : 0)) % 360, S, L, random(minOpacity, maxOpacity));
    }
  }

  update() {
    this.hue = round(random(minHue, maxHue));
    this.updatePetals();
    this.nPetals = abs(round(distort(nPetals, distortionNPetals)));
    if (this.nPetals > this.petals.length) {
      this.addPetals();
    } else {
      this.petals.length = this.nPetals;
    }
  }
}

class Petal {
  constructor(x = width / 2, y = height / 2, radius = .5, c) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.c = c;
    this.randomize();
  }


  show() {
    stroke(0, strokeAlpha);
    strokeWeight(strokeDimension);
    if (colorful)
      fill(this.c);
    else fill(0, 0);
    beginShape();
    bezier(0, 0, this.x1_2, this.y1_2, this.x1_3, this.y1_3, this.xTop, this.yTop);
    bezier(0, 0, this.x2_2, this.y2_2, this.x2_3, this.y2_3, this.xTop, this.yTop);
    bezier
    endShape(CLOSE);
  }

  randomize() {
    this.xTop = distort(-163, distortionTopPetals);
    this.yTop = distort(119, distortionTopPetals);
    this.x1_2 = distort(-41, distortionLeftPetals);
    this.y1_2 = distort(-2, distortionLeftPetals);
    this.x2_2 = distort(-29, distortionRightPetals);
    this.y2_2 = distort(81, distortionRightPetals);
    this.x1_3 = distort(-180, distortionRightPetals);
    this.y1_3 = distort(65, distortionRightPetals);
    this.x2_3 = distort(-81, distortionRightPetals);
    this.y2_3 = distort(82, distortionRightPetals);
  }
}


function distort(value, distortion) {
  return random(value - distortion, value + distortion);
}


// check for keyboard events
function keyPressed() {
  if (key.toLowerCase() === 't') {
    visible = !visible;
    if (visible) {
      gui.show();
      guiColor.show();
      gui.show();
    }
    else {
      gui.hide();
      guiColor.hide();
      gui.hide();
    }
  }
}
