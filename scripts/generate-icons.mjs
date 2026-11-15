import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'packages/icons/src');
const composerDist = join(root, 'packages/composer/dist');
const iconsDist = join(root, 'packages/icons/dist');
const iconsCss = join(iconsDist, 'icons.css');
const componentTargets = [
  join(root, 'packages/react/src/generated'),
  join(root, 'packages/vue/src/generated'),
  join(root, 'packages/react-native/src/generated'),
];

async function listSvgFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listSvgFiles(join(directory, entry.name), path));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.svg') files.push(path);
  }
  return files;
}

function pascalCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').split(/[^a-zA-Z0-9]+/).filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

function jsxMarkup(markup) {
  return markup.replace(/\bclass=/g, 'className=').replace(/\bstroke-width=/g, 'strokeWidth=')
    .replace(/\bstroke-linecap=/g, 'strokeLinecap=').replace(/\bstroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/\bfill-rule=/g, 'fillRule=').replace(/\bclip-rule=/g, 'clipRule=')
    .replace(/\bclip-path=/g, 'clipPath=');
}

function reactComponent(markup) {
  const inner = jsxMarkup(markup.replace(/^\s*<\?xml[^>]*\?>/i, '').trim())
    .replace(/^<svg\b[^>]*>/i, '').replace(/<\/svg>\s*$/i, '').trim();
  const viewBox = markup.match(/\bviewBox=(['"])(.*?)\1/i)?.[2];
  const attrs = viewBox ? ` viewBox="${viewBox}"` : '';
  return `import type { SVGProps } from 'react';\n\nexport interface IconProps extends SVGProps<SVGSVGElement> {\n  size?: number | string;\n}\n\nexport function Icon(props: IconProps) {\n  const { size = 24, ...rest } = props;\n  return (\n    <svg xmlns="http://www.w3.org/2000/svg"${attrs} width={size} height={size} aria-hidden={rest['aria-label'] ? undefined : true} {...rest}>\n      ${inner}\n    </svg>\n  );\n}\nexport default Icon;\n`;
}

function vueComponent(markup) {
  const inner = markup.replace(/^\s*<\?xml[^>]*\?>/i, '').trim()
    .replace(/^<svg\b[^>]*>/i, '').replace(/<\/svg>\s*$/i, '').trim();
  const viewBox = markup.match(/\bviewBox=(['"])(.*?)\1/i)?.[2] ?? '0 0 24 24';
  return `<script setup lang="ts">\nwithDefaults(defineProps<{ size?: number | string; title?: string }>(), { size: 24 })\n</script>\n\n<template>\n  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="${viewBox}" :aria-hidden="title ? undefined : true" role="img">\n    <title v-if="title">{{ title }}</title>\n    ${inner}\n  </svg>\n</template>\n`;
}

function nativeComponent(markup) {
  const viewBox = markup.match(/\bviewBox=(['"])(.*?)\1/i)?.[2] ?? '0 0 24 24';
  const inner = markup.replace(/^\s*<\?xml[^>]*\?>/i, '').trim()
    .replace(/^<svg\b[^>]*>/i, '').replace(/<\/svg>\s*$/i, '').trim()
    .replace(/\b(?:xmlns|width|height|viewBox|class|id|clip-path|fill-rule|clip-rule|stroke-width|stroke-linecap|stroke-linejoin|xml:\w+)=(['"])[\s\S]*?\1/g, '')
    .replace(/\s+>/g, '>');
  return `import React from 'react';\nimport Svg, { SvgProps } from 'react-native-svg';\n\nexport interface IconProps extends SvgProps { size?: number; }\n\nexport function Icon({ size = 24, ...props }: IconProps) {\n  return <Svg width={size} height={size} viewBox="${viewBox}" {...props}>${inner}</Svg>;\n}\nexport default Icon;\n`;
}

const files = await listSvgFiles(source);
const entries = [];
for (const file of files) {
  const svg = await readFile(join(source, file), 'utf8');
  if (!/<svg\b/i.test(svg)) continue;
  const name = pascalCase(file.slice(0, -4).split(sep).join('-'));
  if (!name) continue;
  entries.push({ file, name, svg });
}

await rm(composerDist, { recursive: true, force: true });
await mkdir(composerDist, { recursive: true });
for (const file of files) {
  const destination = join(composerDist, file);
  await mkdir(dirname(destination), { recursive: true });
  await cp(join(source, file), destination);
}

await rm(iconsDist, { recursive: true, force: true });
await mkdir(iconsDist, { recursive: true });

const css = [
  '.finara-icon {',
  '  display: inline-block;',
  '  width: 1em;',
  '  height: 1em;',
  '  background-color: currentColor;',
  '  -webkit-mask: var(--finara-icon) center / contain no-repeat;',
  '  mask: var(--finara-icon) center / contain no-repeat;',
  '  vertical-align: -0.125em;',
  '}',
  '',
];
for (const file of files) {
  const parts = file.split(sep);
  const category = parts.length > 1 ? parts[0] : 'brand';
  const filename = parts.at(-1);
  const className = `finara-icon-${category.toLowerCase().replaceAll('_', '-')}-${filename.slice(0, -4).toLowerCase().replaceAll('_', '-')}`;
  const assetPath = file.split(sep).map(encodeURIComponent).join('/');
  css.push(`.${className} {`, `  --finara-icon: url("../src/${assetPath}");`, '}', '');
}
await writeFile(iconsCss, css.join('\n'));

for (const target of componentTargets) {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
}

for (const { file, name, svg } of entries) {
  const base = file.slice(0, -4).split(sep).join('-').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  const destinations = [
    [componentTargets[0], reactComponent(svg), '.tsx'],
    [componentTargets[1], vueComponent(svg), '.vue'],
    [componentTargets[2], nativeComponent(svg), '.tsx'],
  ];
  for (const [directory, content, extension] of destinations) {
    const output = join(directory, `${base}${extension}`);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, content);
  }
}

const barrels = [
  `import type { ComponentType, SVGProps } from 'react';\n${entries.map(({ file, name }) => `import ${name}Component from './generated/${file.slice(0, -4).split(sep).join('-').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}';\nexport const ${name}Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }> = ${name}Component;`).join('\n')}\n`,
  `${entries.map(({ file, name }) => `import ${name}Component from './generated/${file.slice(0, -4).split(sep).join('-').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}.vue';\nexport const ${name}Icon = ${name}Component;`).join('\n')}\n`,
  `${entries.map(({ file, name }) => `import ${name}Component from './generated/${file.slice(0, -4).split(sep).join('-').replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}';\nexport const ${name}Icon = ${name}Component;`).join('\n')}\n`,
];
for (let i = 0; i < componentTargets.length; i++) {
  await writeFile(join(dirname(componentTargets[i]), 'index.ts'), barrels[i]);
}
console.log(`Copied ${files.length} SVG(s); generated ${entries.length} React, Vue, and React Native components (empty/invalid SVG files skipped).`);
