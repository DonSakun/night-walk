const START_TEXT_SIZE = 0.05; // "tap to start" height, as a fraction of the screen's short side
const START_TEXT_Y = 0.9; // how far down the screen "tap to start" sits, as a fraction of the screen height
const READOUT_SIZE = 0.04; // height of the temporary readout lines, as a fraction of the screen's short side
const READOUT_Y = 0.07; // where the temporary readout lines sit, as a fraction of the screen height

let started = false; // goes up when the start tap's motion request finishes, by any result
let wakeLock = null; // the live screen lock, or null when the browser isn't holding one
let wantAwake = false; // true once we have asked for the lock, so we ask again when the page comes back
let wakeLockAsks = 0; // how many times we have asked; the temporary line shows it

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  lockGestures();
  enableGyroCanvas('');
  showDesktopQr();
  document.addEventListener('visibilitychange', function () {
    if (wantAwake && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });
}

function draw() {
  background(0);
  drawReadout(wakeLockStatus());
  if (!started) {
    drawStartText();
  }
}

function userSetupComplete() {
  started = true;
}

function wakeLockHeld() {
  return 'wakeLock' in navigator && wakeLock !== null && !wakeLock.released;
}

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) {
    return;
  }
  try {
    wakeLockAsks = wakeLockAsks + 1;
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (err) {
    // The browser refused (hidden page, power saving, no gesture yet): carry on
    // quietly. The temporary line shows "not held", and the next tap asks again.
  }
}

function wakeLockStatus() {
  if (!('wakeLock' in navigator)) {
    return 'wake lock: not supported here';
  }
  return wakeLockHeld()
    ? 'wake lock: held (asked ' + wakeLockAsks + ')'
    : 'wake lock: not held (asked ' + wakeLockAsks + ')';
}

function drawReadout(message) {
  push();
  fill(255, 255, 255, 160);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(READOUT_SIZE * min(width, height));
  text(message, width / 2, READOUT_Y * height);
  pop();
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

function mouseReleased() {
  if ('wakeLock' in navigator && !wakeLockHeld()) {
    wantAwake = true;
    requestWakeLock();
  }
  return false;
}
