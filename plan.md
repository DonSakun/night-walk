# Plan: Night Walk

<!-- Everything above Steps is yours. Write it yourself, in your own words.
     The agent writes the Steps. You cut them down before anything is built. -->

## Project
Phone as a lantern, to set up the mood, for people walking together in the dark.

## The question
[What this prototype tests. What would tell you it works.]

## The experience
1. open the sketch through a browser
2. the walkers see fully dark screen at the start
3. lit up with the rhythm of their walk

Where they are: people walking together in the dark, the phone hanging in a swinging hand.
The end: just let it fade, nothing happen.

## Input, transformation, output, fallback
- Input: rhythm of each step. Hanging in a swinging hand. Count both tap and swing.
- Transformation:
  - color jump to a different warm shade
  - random each time
  - amber to red-orange
  - barely different is fine
  - change instantly
  - moving: bright + a little bigger. Just stay a little bigger while someone is walking and shrink back as it fades.
  - still: 4 seconds, then fades (5 s) to fully black
  - move again: back in about 1 s
  - [swing size, and the shortest pause between two swings: to test on my phone]
- Output: warm and show variation of warm colors as the light. Fully dark, no color at the start. Glow. Warm, soft edge fades. Back to fully black when I stop.
- Fallback: a click. No need for a laptop check.

## References
| File | Use it as | Take | Leave |
|---|---|---|---|
| references/layout-lantern.jpg | layout: match this | all dark, no edges. Warm, soft edge fades. Glow sits LOW, below the middle. "tap to start" is small, only before start. | The rays and the inner ring: only my way of showing the glow in the sketch. |
| references/mood-night-lanterns.jpg | inspiration: the feel | Only the softness, because my layout has one glow. | [the rest] |

## Limits
- Change only sketch.js.
- Not now: all of this can be left out: sound or vibration, the real flashlight (LED), phones reacting to each other, a way to end the walk, landscape or a laptop layout.

## How I will check it
- On my laptop: No need for a laptop check.
- On my phone:
  - the first screen after you tap start: fully black screen
  - the first swing: Glow
  - when you stop: back to full black screen
  - when you set off again: glow

## Steps
<!-- Written by the agent. Each step small enough to check on your phone. -->

**Before you start.** Read the p5-phone skill and the p5js-2x skill. Write p5.js 2 code. Read phone values from p5's own globals and use p5-phone for permissions. Do not write your own sensor, touch or audio plumbing. Use `mousePressed` / `mouseReleased`, never `touchStarted`. Change only sketch.js. If index.html does not already load p5.js 2 and p5-phone, stop and tell me. Stop after each step and wait for me to check it on my phone.

**Numbers rule.** Every number that I may want to tune goes in a named value at the very top of sketch.js, with a one-line comment saying what it does. Each step lists the ones it adds.

**Laptop rule.** My plan says no laptop check, so every step says "Laptop: no check."

Checks that use temporary text on screen (steps 3 to 5) are removed in step 10.

### Step 1. Dark canvas
- Build: a full-screen portrait canvas that is black, with page gestures locked so the phone doesn't scroll, zoom or pull to refresh.
- Use: `createCanvas(windowWidth, windowHeight)`, `background()`, p5-phone `lockGestures()`. Return `false` from `mousePressed()` as the p5-phone skill's minimal sketch does.
- Laptop: no check.
- Phone: a black screen. Swiping, pinching and long-pressing do nothing.
- New numbers: none.

### Step 2. Start screen and motion permission
- Build: a small "tap to start" low on the screen, as in layout-lantern.jpg, shown only before start. One tap asks for motion permission. After it, the text is gone and the screen is fully black. Keep a "started" flag. The start tap itself is not a swing.
- Use: one activation style only, `enableSensorCanvas('tap to start')` (or the nearest p5-phone style that can show small text low on the screen), `window.sensorsEnabled`, `userSetupComplete()`, `textAlign()`, `textSize()`, `fill()`, `text()`. If the tap leaves the sketch stuck after the person denies motion access, stop and tell me instead of working around it.
- Laptop: no check.
- Phone: on iPhone, a motion permission prompt appears at the tap and I allow it. On Android there is no prompt. Either way the text disappears and the screen is fully black.
- New numbers: `START_TEXT_SIZE`, `START_TEXT_Y` (how far down the screen the text sits).

### Step 3. Keep the screen on
- Build: ask the browser to keep the screen awake from the same start tap, and ask again whenever the page becomes visible again. If the browser refuses, carry on quietly. Show a temporary line on screen saying whether the lock is held.
- Use: the browser's `navigator.wakeLock`, as the p5-phone skill's Screen Wake Lock section describes, requested from `mouseReleased()`, with a `visibilitychange` listener. This is not a p5-phone function. Do not invent one. Use `try`/`catch`. This will not work in the p5.js Web Editor. It needs my own hosted page.
- Laptop: no check.
- Phone: after the start tap, the temporary line says the lock is held. I leave the phone untouched for over a minute, and the screen stays on. I lock the phone, unlock it, and the line says the lock was asked for again.
- New numbers: none.

### Step 4. Read the motion
- Build: after start, show the phone's acceleration as a number on screen, temporarily, and nothing else. It should be one number for how hard the phone is moving.
- Use: `window.sensorsEnabled` before reading anything, p5's `accelerationX/Y/Z` and `pAccelerationX/Y/Z`, `mag()`, `nf()` or `text()` for the readout. No custom `devicemotion` listener, and no `rotationRate*` (p5 does not have it).
- Laptop: no check.
- Phone: holding the phone still, the number sits low. Hanging in my hand and swinging as I walk, it rises on each swing. I write down roughly the highest value when swinging and the lowest when still, and give them to you.
- New numbers: none.

### Step 5. Count swings
- Build: count a swing when the movement number passes a set size, and ignore anything for a short pause after each swing so one arm swing doesn't count twice. A tap or click counts as a swing too, except the start tap. Show the swing count on screen, temporarily.
- Use: `mag()`, `millis()`, `mousePressed()` (returning `false`). Start from the numbers I wrote down in step 4.
- Laptop: no check.
- Phone: each arm swing adds exactly one to the count. Standing still adds nothing. A tap adds one. The start tap adds nothing.
- New numbers: `SWING_SIZE`, `SWING_PAUSE_MS`.

### Step 6. The glow, with one swing
- Build: one soft warm glow, a fixed amber, with a soft edge that fades, sitting low and below the middle as in layout-lantern.jpg. No rays, no inner ring. A swing or tap brings it in over about 1 s. For now it stays lit.
- Use: p5's own drawing only: `noStroke()`, `fill()` with alpha, `circle()`, `lerp()`, `map()`, `constrain()`, `millis()`. A soft edge can come from stacked circles that get fainter outward. No new libraries.
- Laptop: no check.
- Phone: a swing or tap, and a glow fades in over about 1 s. Its position and size match the layout image. Its edge is soft, with no hard line anywhere.
- New numbers: `GLOW_CENTER_Y`, `GLOW_SIZE`, `GLOW_SOFTNESS`, `GLOW_BRIGHTNESS`, `RETURN_MS`, `COLOR_AMBER`.

### Step 7. Wait and fade
- Build: after the last swing, hold the glow for 4 s, then fade it to fully black over 5 s. The glow is a little bigger while it is lit and shrinks as it fades. A swing during the wait or the fade brings it back in about 1 s from wherever it is.
- Use: `millis()`, `lerp()`, `constrain()`, `map()`.
- Laptop: no check.
- Phone: tap once, then watch. About 4 s of full glow, then about 5 s of fading and shrinking to a fully black screen. Tap again partway through the fade, and it returns in about 1 s.
- New numbers: `HOLD_MS`, `FADE_MS`, `SIZE_SMALL` (how much smaller than full size it ends up).

### Step 8. Colour jump
- Build: on every swing or tap, pick a random warm shade between amber and red-orange and switch to it instantly, with no blend. No minimum difference from the last shade. The first swing from black picks one too.
- Use: `random()`, `lerpColor()`, `color()`.
- Laptop: no check.
- Phone: tap several times. Every tap changes the shade at once. Every shade is between amber and red-orange, with no yellow-green and no pink.
- New numbers: `COLOR_RED_ORANGE`. Choose both end colours by eye and tell me what you picked.

### Step 9. Tune on a walk
- Build: nothing new. Check that every tuning number is in the named values at the top of sketch.js with a comment. Change one number at a time, only what I ask.
- Use: nothing new.
- Laptop: no check.
- Phone: I walk with the phone hanging in my swinging hand. The glow lights with my swing, holds while I keep walking, and fades when I stop. It doesn't flicker in the middle of a stride, and it doesn't die while I'm walking.
- New numbers: none.

### Step 10. Clean up and final check
- Build: remove the temporary readouts and wake lock line. Check the sketch against "How I will check it" and against layout-lantern.jpg. Report anything that does not match. Don't fix it without asking.
- Use: nothing new.
- Laptop: no check.
- Phone: the four moments in "How I will check it" all happen, in order: fully black after start, the glow on the first swing, fully black after I stop, the glow again when I set off.
- New numbers: none.

## What the agent had to assume
Check these. Change the plan above if any is wrong.
- The sketch is served over HTTPS (or localhost) on my phone. Motion sensors and the wake lock need that.
- Index.html already loads p5.js 2 and p5-phone. Step 1 stops if not.
- The project name "Night Walk" comes from the title on your layout image.
- "Phone as a lantern, to set up the mood" turns your "setting up the mood" into the template's wording.
- "The question" is left in brackets. You picked the test "the light stays in step with the walk" from a list of three, but didn't write it in your words.
- The "Leave" cell for the mood photo is left in brackets. You said "only the softness"; I did not decide the rest for you.
- "Not now" is my list of five things, accepted with "all of this can be left out".
- "tap to start" and the start tap come from your layout. Your three experience lines don't mention it.
- The first swing from black also takes about 1 s to come in, like "move again".
- The glow in your layout is the size it is at its biggest. I read it as roughly three quarters of the screen width, centered about two thirds of the way down. Treat that as a starting value to tune in step 6.
- "Fully black" at the end replaces the "almost dark" note in your layout.
- The glow's size and brightness follow one shared fade. Each swing changes only the colour.
- If the person denies motion access, taps still start and light the sketch.
- The start tap uses one p5-phone activation style, the canvas style, so the text can be small and low. If it can't, the agent picks the nearest style and tells me.

## Changes
<!-- Yours. One line each time you change this plan, and why. -->
