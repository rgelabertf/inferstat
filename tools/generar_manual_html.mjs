import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const bodyPath = resolve(tmpdir(), 'inferstat_manual_body.html');

let html = readFileSync(bodyPath, 'utf8');

// pandoc references media/<hash>.png but does not always write them to disk;
// map them in order to the project's original assets.
const ASSETS = [
  resolve(ROOT, 'assets', 'visual_inference_infographic.png'),
  resolve(ROOT, 'assets', 'inference_rules_diagram.png'),
];
let i = 0;
html = html.replace(/src="media\/[^"]+"/g, () => {
  const b = readFileSync(ASSETS[i]).toString('base64');
  i++;
  return `src="data:image/png;base64,${b}"`;
});

const css = `
@page { size: A4; margin: 20mm 18mm 18mm 18mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', 'Calibri', Arial, sans-serif; color: #111827; font-size: 10.5pt; line-height: 1.5; margin: 0; }
.cover { text-align: center; padding: 70px 0 60px; }
.cover h1 { font-size: 26pt; margin: 8px 0 4px; color: #0F1115; }
.cover h2 { font-size: 13pt; font-weight: 600; color: #4B5563; margin: 0; }
.cover .title { font-size: 30pt; font-weight: 800; color: #0F1115; margin: 34px 0 0; }
.cover .subtitle { font-size: 12pt; font-style: italic; color: #4B5563; margin: 8px 0 0; }
.cover .author { margin-top: 70px; font-size: 13pt; font-weight: 700; }
.cover .year { font-size: 11pt; color: #4B5563; }
.cover .url { margin-top: 30px; font-size: 10pt; color: #2563EB; }
h1 { color: #2563EB; font-size: 15pt; border-bottom: 2px solid #2563EB; padding-bottom: 3px; margin: 26px 0 10px; page-break-after: avoid; }
h2 { color: #1D4ED8; font-size: 12.5pt; margin: 18px 0 6px; page-break-after: avoid; }
h3 { color: #4B5563; font-size: 11pt; margin: 14px 0 4px; page-break-after: avoid; }
p { margin: 6px 0; text-align: justify; }
ul, ol { margin: 6px 0 6px 4px; padding-left: 22px; }
li { margin-bottom: 3px; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 9.5pt; page-break-inside: avoid; }
th { background: #2563EB; color: #fff; text-align: left; padding: 5px 8px; }
td { border: 1px solid #CBD5E1; padding: 5px 8px; }
tr:nth-child(even) td { background: #F3F4F6; }
img { display: block; margin: 14px auto; max-width: 100%; }
figure { margin: 10px 0; text-align: center; font-style: italic; color: #4B5563; font-size: 9pt; }
strong { color: #111827; }
.footer-note { margin-top: 26px; padding-top: 8px; border-top: 1px solid #CBD5E1; color: #4B5563; font-size: 9pt; }
.cover { page-break-after: always; }
`;

const full = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>InferStat — Manual de Usuario</title><style>${css}</style></head><body>${html}</body></html>`;

const href = resolve(ROOT, 'versión para compartir', 'InferStat_Manual_Usuario_UNACAR.html');
writeFileSync(href, full, 'utf8');
console.log('OK', href, full.length, 'bytes');