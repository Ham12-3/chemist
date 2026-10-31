# ChemLab 3D

A 3D virtual chemistry laboratory in a single file: `index.html`. Three.js 0.160.0 loads from a CDN, so you need an internet connection.

**Live site:** https://chemlab-3d.vercel.app. Share this link with students; it needs no account. There's also an offline copy to download: https://chemlab-3d.vercel.app/chemlab-offline.html.

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

This writes `dist/chemlab-offline.html` (about 1.2 MB), which makes no network requests. It also writes `dist/index.html`, the same page used for the website.

### Update the live site

After changing `index.html`, rebuild and deploy (Vercel CLI, personal scope):

```bash
node tools/build-offline.mjs
```
```bash
vercel deploy dist --prod --yes --project chemlab-3d --scope ham12-3s-projects
```

The website uses the bundled build, so it makes no requests to third-party CDNs. School networks often block those.

### Slow computers

The lab lowers its resolution, then turns off shadows, if the frame rate stays below about 42 fps. To start in low quality straight away, add `?quality=low` to the address.

## Self-test

Add `?test` to the address (for example `http://localhost:8123/?test`) to run the built-in test suite in any browser. It runs 104 checks in about two and a half minutes:

- data integrity
- the pH engine against textbook values
- reaction rules, indicator colours, magnesium kinetics and electrolysis rules
- full runs through all eight experiments, plus safety checks, saving and the tour
- teacher settings, the share link and reports

Results appear in a panel with a "Copy report" button. Keep the tab visible while it runs, because browsers pause background tabs.

## Experiments

0. Free lab: mix any of the chemicals on the bench
1. Acid–base titration (HCl against NaOH, phenolphthalein, live pH and titration curve; a rough run, then repeat runs until two titres are concordant)
2. Flame tests (Li⁺, Na⁺, K⁺, Ca²⁺, Cu²⁺, plus an unknown sample X to identify)
3. Precipitation reactions (silver halides, copper(II) hydroxide)
4. Universal indicator and the pH scale
5. Thermal decomposition of copper(II) carbonate, with the limewater test
6. Rates of reaction: magnesium and 1.0 M or 0.50 M hydrochloric acid, gas syringe, live volume–time graph, squeaky-pop test for hydrogen
7. Electrolysis of copper(II) sulfate with graphite electrodes and a power pack (copper at the cathode, oxygen at the anode; chloride solutions give chlorine)
8. Paper chromatography of four inks, with Rf values and an unknown ink

Slow experiments (6–8) have a ⏩ button that speeds up time.

On a first visit a short guided tour explains the controls; it includes two "try it" steps. Progress is saved automatically in the browser (`localStorage`): the bench, the current step, the notebook, which experiments are finished and the best quiz scores. The welcome screen offers "Continue where you left off", and burners and hot plates come back switched off. The ? button can replay the tour or clear saved progress. Saving is per browser and per device; it doesn't sync between computers.

Undo (Ctrl+Z, or the arrow button in the top bar) reverses pours, drops, and pipette or burette actions. Drag a test tube to move it to an empty slot in a rack.

## Note for teachers

Hazard labels in the app err on the side of caution. Before using it with a class, check them against your own hazard cards (for example CLEAPSS or SSERC).

**Teacher tools** (? button → Teacher tools, or add `?teacher` to the address):

- **Class settings:** a fixed or random acid concentration for the titration, the metal ion in flame-test sample X, and the dyes in chromatography ink D.
- **Share link:** copy a link that carries your settings, for example `https://chemlab-3d.vercel.app/?hcl=0.0950&flame=K&ink=br`. Students who open it get those unknowns, with no account needed.
- **Reports:** students press **Report** in the side panel, or you use Teacher tools, to print or save as PDF, or download a text file. A report has a marking summary (steps completed, answers that needed another try, safety warnings, quiz score and result accuracy), the results tables and the full notebook.

Settings are stored in the browser and in the link, not on a server. A curious student can open Teacher tools and see the answers, so use the unknowns for practice rather than formal assessment.

## Code layout (inside `index.html`)

1. **Scene**: renderer, camera, lights, room, bench, fume hood, sink
2. **Equipment**: glassware built from lathe and cylinder geometry, with volume-accurate liquid levels
3. **Chemistry engine**: `SUBSTANCES`, `REACTIONS`, and pH from a charge balance (strong ions plus weak-acid equilibria)
4. **Interaction**: select, drag and snap, pour, drops, pipette, burette, heating, flame tests, effects
5. **Experiments**: set-up, guided steps with checks, quizzes
6. **UI**: side panel, notebook, info card, modals, theme
7. **Main loop**: adaptive quality, start-up
8. **Self-test**: the `?test` suite
