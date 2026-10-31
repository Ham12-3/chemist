# ChemLab 3D

A 3D virtual chemistry laboratory in a single file: `index.html`. Three.js 0.160.0 loads from a CDN, so you need an internet connection.

## Run it

Open `index.html` in a browser. If your browser blocks the module import when the file is opened directly, serve the folder instead:

```bash
python -m http.server 8123
```

Then go to http://localhost:8123.

## Experiments (Phase 1)

0. Free lab: mix any of the chemicals on the bench
1. Acid–base titration (HCl against NaOH, phenolphthalein, live pH and titration curve)
2. Flame tests (Li⁺, Na⁺, K⁺, Ca²⁺, Cu²⁺)
3. Precipitation reactions (silver halides, copper(II) hydroxide)
4. Universal indicator and the pH scale
5. Thermal decomposition of copper(II) carbonate, with the limewater test

## Code layout (inside `index.html`)

1. **Scene**: renderer, camera, lights, room, bench, fume hood, sink
2. **Equipment**: glassware built from lathe and cylinder geometry, with volume-accurate liquid levels
3. **Chemistry engine**: `SUBSTANCES`, `REACTIONS`, and pH from a charge balance (strong ions plus weak-acid equilibria)
4. **Interaction**: select, drag and snap, pour, drops, pipette, burette, heating, flame tests, effects
5. **Experiments**: set-up, guided steps with checks, quizzes
6. **UI**: side panel, notebook, info card, modals, theme

The page exposes `window.chemlab` for debugging in the browser console.
