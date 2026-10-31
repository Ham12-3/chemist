// Builds dist/chemlab-offline.html: the same lab, with Three.js embedded so it works with no internet.
// Usage:  node tools/build-offline.mjs
// The first run downloads the pinned Three.js files into vendor/ (later runs reuse them).
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = '0.160.0';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR = join(ROOT, 'vendor', `three-${VERSION}`);
const CDN = `https://cdn.jsdelivr.net/npm/three@${VERSION}/`;

// import-map specifier → file inside the three package
const MODULES = {
  'three': 'build/three.module.min.js',
  'three/addons/controls/OrbitControls.js': 'examples/jsm/controls/OrbitControls.js',
  'three/addons/environments/RoomEnvironment.js': 'examples/jsm/environments/RoomEnvironment.js',
};

async function exists(p) { try { await access(p); return true; } catch { return false; } }

async function getModule(path) {
  const local = join(VENDOR, path.replace(/\//g, '_'));
  if (!(await exists(local))) {
    console.log(`Downloading ${CDN}${path}`);
    const res = await fetch(CDN + path);
    if (!res.ok) throw new Error(`Download failed (${res.status}) for ${path}`);
    await mkdir(VENDOR, { recursive: true });
    await writeFile(local, await res.text(), 'utf8');
  }
  return readFile(local, 'utf8');
}

const html = await readFile(join(ROOT, 'index.html'), 'utf8');
const mapRe = /<script type="importmap">[\s\S]*?<\/script>/;
if (!mapRe.test(html)) throw new Error('No import map found in index.html');

const imports = {};
for (const [specifier, path] of Object.entries(MODULES)) {
  const code = await getModule(path);
  imports[specifier] = 'data:text/javascript;base64,' + Buffer.from(code, 'utf8').toString('base64');
}
const offline = html
  .replace(mapRe, `<script type="importmap">\n${JSON.stringify({ imports })}\n</script>`)
  .replace('<title>ChemLab 3D</title>', '<title>ChemLab 3D (offline)</title>');

// Every module the page imports must be covered by the new import map.
const used = [...offline.matchAll(/from '(three[^']*)'/g)].map(m => m[1]);
const missing = used.filter(u => !(u in imports));
if (missing.length) throw new Error('Not bundled: ' + missing.join(', '));

await mkdir(join(ROOT, 'dist'), { recursive: true });
const out = join(ROOT, 'dist', 'chemlab-offline.html');
await writeFile(out, offline, 'utf8');
console.log(`Wrote ${out} (${(offline.length / 1024 / 1024).toFixed(2)} MB)`);

// The same bundled page as the website's home page: no third-party requests, so it also works
// on school networks that block CDNs. Deploy with:  vercel deploy dist --prod
const site = offline.replace('<title>ChemLab 3D (offline)</title>', '<title>ChemLab 3D</title>');
await writeFile(join(ROOT, 'dist', 'index.html'), site, 'utf8');
console.log(`Wrote ${join(ROOT, 'dist', 'index.html')} (website version)`);
