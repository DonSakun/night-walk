const START_TEXT_SIZE = 0.05; // "tap to start" height, as a fraction of the screen's short side
const START_TEXT_Y = 0.9; // how far down the screen "tap to start" sits, as a fraction of the screen height

let started = false; // goes up when the start tap's motion request finishes, by any result

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  lockGestures();
  enableGyroCanvas('');
  showDesktopQr();
}

function draw() {
  background(0);
  if (!started) {
    drawStartText();
  }
}

function userSetupComplete() {
  started = true;
}

function drawStartText() {
  push();
  fill(255, 255, 255, 200);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(START_TEXT_SIZE * min(width, height));
  text('tap to start', width / 2, START_TEXT_Y * height);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function mousePressed() {
  return false;
}
