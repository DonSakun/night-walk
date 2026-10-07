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

**Numbers rule.** Every number that I may want to tune goes in a named value at the very top of sketch.js, with a one-line comment saying what it does. Each step lists the ones it adds. Two kinds of value live differently. Screen geometry (text position, glow position and size) is written as a fraction of the screen and applied at draw time, like `START_TEXT_Y * height`, because the top of the file has no `width` or `height` yet. Colours are written as three plain numbers, red, green, blue, and built into p5 colours with `color()` inside `setup()`, because p5's functions do not exist at the top of the file at all: calling `color()` or `random()` up there throws.

**Laptop rule.** My plan says no laptop check, so every step says "Laptop: no check."

Checks that use temporary text on screen (steps 3 to 5) are removed in step 12. They share the two numbers added in step 3, `READOUT_SIZE` and `READOUT_Y`, so every readout has one size and one place to tune.

### Step 1. Dark canvas
- Build: a full-screen canvas that is black from its first frame, with page gestures locked so the phone doesn't scroll, zoom or pull to refresh. Add a `windowResized()` that resizes the canvas and repaints it black, so turning the phone in your hand doesn't leave a hole. Show a desktop QR with p5-phone's `showDesktopQr()`, so the laptop can open this same sketch on the phone; it appears on the laptop only and does nothing on the phone.
- Use: `createCanvas(windowWidth, windowHeight)`, `background()` in `setup()` and at the top of every `draw()` frame, `windowResized()`, `resizeCanvas()`, p5-phone `lockGestures()` and `showDesktopQr()`. Return `false` from `mousePressed()` as the p5-phone skill's minimal sketch does.
- Laptop: no check.
- Phone: a black screen. Swiping, pinching and long-pressing do nothing. Turning the phone keeps the whole screen black.
- New numbers: none.

### Step 2. Start screen and motion permission
- Build: a small "tap to start" low on the screen, as in layout-lantern.jpg, shown only before start. One tap asks for motion permission. When the request finishes, a "started" flag goes up, the text is gone and the screen is fully black. The start tap itself is not a swing.
- Use: one activation style only, `enableGyroCanvas('')`. The empty message is deliberate: p5-phone's own canvas text is centred, sits at 90% down, and stops redrawing after about 2.5 seconds, so it can neither match the layout nor be trusted to stay on screen, while an empty message still binds the start tap to the canvas. Draw the text yourself with `textAlign()`, `textSize()`, `fill()`, `text()`, only while `started` is false, and set `started` in `userSetupComplete()` (p5-phone calls that after the request finishes, even if the person denies motion). Use `window.sensorsEnabled` as the gate. If the tap leaves the sketch stuck with the text still showing, stop and tell me instead of working around it.
- Laptop: no check.
- Phone: on iPhone, a motion permission prompt appears at the tap and I allow it. On Android there is no prompt. Either way the text disappears and the screen is fully black.
- New numbers: `START_TEXT_SIZE`, `START_TEXT_Y` (text size, and how far down the screen it sits, both fractions of the screen).

### Step 3. Keep the screen on
- Build: ask the browser to keep the screen awake from the same start tap, and ask again on any later tap while the lock is not held, and whenever the page becomes visible again. If the browser refuses, carry on quietly. Show a temporary line on screen saying whether the lock is held.
- Use: the browser's `navigator.wakeLock`, as the p5-phone skill's Screen Wake Lock section describes: requested from `mouseReleased()` (which must also `return false`, like `mousePressed()`), guarded by a check that the lock isn't already held, with a `visibilitychange` listener and `try`/`catch`. This is not a p5-phone function. Do not invent one. This will not work in the p5.js Web Editor. It needs my own hosted page.
- Laptop: no check.
- Phone: after the start tap, the temporary line says the lock is held. If iOS refused the first request while the motion prompt was still up, the next tap asks again and then the line says the lock is held. I leave the phone untouched for over a minute, and the screen stays on. I lock the phone, unlock it, and the line says the lock was asked for again.
- New numbers: `READOUT_SIZE`, `READOUT_Y` (size and place of the temporary lines in this step and in steps 4 and 5, as fractions of the screen).

### Step 4. Read the motion
- Build: after start, show the phone's acceleration as a number on screen, temporarily, and nothing else. It should be one number for how hard the phone is moving.
- Use: `window.sensorsEnabled` before reading anything, p5's `accelerationX/Y/Z` and `pAccelerationX/Y/Z`, `mag()`, `nf()` or `text()` for the readout. No custom `devicemotion` listener, and no `rotationRate*` (p5 does not have it). If the number never rises while you swing: either motion was denied (p5-phone turns `sensorsEnabled` on either way, so the gate passes and the readout just sits at zero), or this phone reports its motion in a way p5 can't read, which may also pop p5-phone's debug overlay over the black screen. Stop and tell me what you see instead of writing down numbers.
- Laptop: no check.
- Phone: holding the phone still, the number sits low. Hanging in my hand and swinging as I walk, it rises on each swing. I write down roughly the highest value when swinging and the lowest when still, and give them to you.
- New numbers: none.

### Step 5. Count swings
- Build: count a swing when the movement number passes a set size, and ignore anything for a short pause after each swing so one arm swing doesn't count twice. A tap or click counts as a swing too, except the start tap. Show the swing count on screen, temporarily.
- Use: `mag()`, `millis()`, `mousePressed()` (returning `false`). Start from the numbers I wrote down in step 4.
- Laptop: no check.
- Phone: each arm swing adds exactly one to the count. Standing still adds nothing. A tap adds one. The start tap adds nothing.
- New numbers: `SWING_SIZE`, `SWING_PAUSE_MS`.

### Step 6. The glow, drawn to the layout
- Build: one soft warm glow, a fixed amber, sitting low and below the middle as in layout-lantern.jpg. No rays, no inner ring. For this step it is simply always lit, so its place, size and edge can be judged on their own. The soft edge comes from stacked circles: `GLOW_LAYERS` circles, largest and faintest at the outside, shrinking to a solid core, with `GLOW_SOFTNESS` setting how far the soft edge spreads past the core.
- Use: p5's own drawing only: `noStroke()`, `fill()` with alpha, `circle()`, `map()`, `constrain()`. The amber is `COLOR_AMBER`, three plain numbers at the top, built into a p5 colour with `color()` in `setup()`. No new libraries.
- Laptop: no check.
- Phone: the glow sits where the layout image puts it and is the size it is there, its edge is soft with no hard line anywhere, and it stays like that however long I look.
- New numbers: `GLOW_CENTER_Y`, `GLOW_SIZE` (place and size as fractions of the screen, starting at two thirds down and three quarters of the width), `GLOW_SOFTNESS`, `GLOW_LAYERS` (how many stacked circles the edge is made of), `GLOW_BRIGHTNESS`, `COLOR_AMBER` (three plain numbers).

### Step 7. The glow answers a swing
- Build: wire the glow to the swing count from step 5. It now starts at 0, a fully black screen, instead of always lit: a swing or a tap raises it to full over about 1 s, and while swings keep coming it stays lit.
- Use: `millis()` for elapsed time, plus `map()` and `constrain()`: work out a 0 to 1 progress from how long ago the last swing was, over `RETURN_MS`, and drive brightness and size from that progress. Do not step by a fixed amount every frame, because that makes "about 1 s" depend on how fast the frames run.
- Laptop: no check.
- Phone: the screen starts fully black. A swing or a tap brings the glow in over about 1 s, in the place and at the size step 6 settled. Keep swinging and it stays lit.
- New numbers: `RETURN_MS`.

### Step 8. Wait, then fade
- Build: after the last swing, hold the glow for 4 s, then fade it to fully black over 5 s. The glow is a little bigger while it is lit and shrinks as it fades, driven by one shared level so size and brightness always fall together. Every swing resets the wait, so walking keeps it at full.
- Use: `millis()` and the same elapsed-time progress as step 7, for `HOLD_MS` and `FADE_MS`, plus `map()`, `constrain()`.
- Laptop: no check.
- Phone: tap once, then watch. About 4 s of full glow, then about 5 s of fading and shrinking to a fully black screen. Tap again during the wait, and the 4 s starts over.
- New numbers: `HOLD_MS`, `FADE_MS`, `SIZE_SMALL` (how much smaller than full size it ends up).

### Step 9. A swing during the wait or the fade
- Build: a swing or tap during the 4 s wait or during the 5 s fade brings the glow back to full in about 1 s, starting from wherever it has got to, not from black.
- Use: the same `RETURN_MS` progress as step 7, but rising from the current level instead of from 0. Nothing new to invent.
- Laptop: no check.
- Phone: tap again partway through the fade, and it returns to full glow in about 1 s. Tap during the wait, and it carries on at full glow.
- New numbers: none.

### Step 10. Colour jump
- Build: on every swing or tap, pick a random warm shade between amber and red-orange and switch to it instantly, with no blend. No minimum difference from the last shade. The first swing from black picks one too.
- Use: `random()` and `lerpColor()` in `draw()`. Both end colours are three plain numbers at the top of the file, built into p5 colours with `color()` in `setup()`, because p5's functions do not exist at the top of the file.
- Laptop: no check.
- Phone: tap several times. Every tap changes the shade at once. Every shade is between amber and red-orange, with no yellow-green and no pink.
- New numbers: `COLOR_RED_ORANGE`. Choose both end colours by eye and tell me what you picked.

### Step 11. Tune on a walk
- Build: nothing new. Check that every tuning number is in the named values at the top of sketch.js with a comment. Change one number at a time, only what I ask.
- Use: nothing new.
- Laptop: no check.
- Phone: I walk with the phone hanging in my swinging hand. The glow lights with my swing, holds while I keep walking, and fades when I stop. It doesn't flicker in the middle of a stride, and it doesn't die while I'm walking.
- New numbers: none.

### Step 12. Clean up and final check
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
