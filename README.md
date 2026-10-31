# ChemLab 3D

A 3D virtual chemistry laboratory in a single file: `index.html`. Three.js 0.160.0 loads from a CDN, so you need an internet connection.

## Run it

Open `index.html` in a browser. If your browser blocks the module import when the file is opened directly, serve the folder instead:

```bash
python -m http.server 8123
```

Then go to http://localhost:8123.

### Without internet

Build a standalone copy with Three.js embedded (needs Node 18+, and internet once to download Three.js):

```bash
node tools/build-offline.mjs
```

This writes `dist/chemlab-offline.html` (about 1.1 MB), which makes no network requests.

### Slow computers

The lab lowers its resolution, then turns off shadows, if the frame rate stays below about 42 fps. To start in low quality straight away, add `?quality=low` to the address.

## Self-test

Add `?test` to the address (for example `http://localhost:8123/?test`) to run the built-in test suite in any browser. It takes about 40 seconds and covers:

- data integrity
- the pH engine against textbook values
- reaction rules and indicator colours
- full runs through all five experiments, plus safety checks

Results appear in a panel with a "Copy report" button. Keep the tab visible while it runs, because browsers pause background tabs.

## Experiments (Phase 1)

0. Free lab: mix any of the chemicals on the bench
1. Acid–base titration (HCl against NaOH, phenolphthalein, live pH and titration curve; a rough run, then repeat runs until two titres are concordant)
2. Flame tests (Li⁺, Na⁺, K⁺, Ca²⁺, Cu²⁺)
3. Precipitation reactions (silver halides, copper(II) hydroxide)
4. Universal indicator and the pH scale
5. Thermal decomposition of copper(II) carbonate, with the limewater test

On a first visit a short guided tour explains the controls; it includes two "try it" steps. Progress is saved automatically in the browser (`localStorage`): the bench, the current step, the notebook, which experiments are finished and the best quiz scores. The welcome screen offers "Continue where you left off", and burners and hot plates come back switched off. The ? button can replay the tour or clear saved progress. Saving is per browser and per device; it doesn't sync between computers.

Undo (Ctrl+Z, or the arrow button in the top bar) reverses pours, drops, and pipette or burette actions. Drag a test tube to move it to an empty slot in a rack.

## Note for teachers

Hazard labels in the app err on the side of caution. Before using it with a class, check them against your own hazard cards (for example CLEAPSS or SSERC).

## Code layout (inside `index.html`)

1. **Scene**: renderer, camera, lights, room, bench, fume hood, sink
2. **Equipment**: glassware built from lathe and cylinder geometry, with volume-accurate liquid levels
3. **Chemistry engine**: `SUBSTANCES`, `REACTIONS`, and pH from a charge balance (strong ions plus weak-acid equilibria)
4. **Interaction**: select, drag and snap, pour, drops, pipette, burette, heating, flame tests, effects
5. **Experiments**: set-up, guided steps with checks, quizzes
6. **UI**: side panel, notebook, info card, modals, theme
7. **Main loop**: adaptive quality, start-up
8. **Self-test**: the `?test` suite
