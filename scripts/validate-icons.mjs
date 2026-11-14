import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/icons/src');
async function listSvgFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listSvgFiles(join(directory, entry.name), relative));
    else if (entry.isFile() && entry.name.endsWith('.svg')) files.push(relative);
  }
  return files;
}

const files = await listSvgFiles(source);
const errors = [];

for (const file of files) {
  const svg = await readFile(join(source, file), 'utf8');
  if (!svg.trim()) continue;
  if (!/<svg\b/i.test(svg)) errors.push(`${file}: expected valid SVG markup`);
  if (!/viewBox=/i.test(svg) && (!/width=/i.test(svg) || !/height=/i.test(svg))) {
    errors.push(`${file}: SVG must declare viewBox or width/height dimensions`);
  }
  if (/<script\b|\bon\w+\s*=|javascript:/i.test(svg)) errors.push(`${file}: unsafe SVG content`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} SVG icon(s).`);
}
