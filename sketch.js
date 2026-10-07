function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  lockGestures();
  showDesktopQr();
}

function draw() {
  background(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function mousePressed() {
  return false;
}
