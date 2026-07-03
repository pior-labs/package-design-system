import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(packageRoot, 'src');
const bundles = [
  {
    output: 'styles.css',
    files: ['styles.css', 'themes/bloom.css', 'tailwind-contract.css', 'themes/slate.css']
  },
  {
    output: 'effects.css',
    files: ['effects.css', 'helpers.css']
  }
];

function stripLocalImports(css) {
  return css.replace(/^@import\s+".*";\s*$/gm, '').trim();
}

for (const bundle of bundles) {
  const sections = [];
  for (const file of bundle.files) {
    const css = await readFile(path.join(sourceRoot, file), 'utf8');
    sections.push(`/* ${file} */\n${stripLocalImports(css)}`);
  }

  const outputPath = path.join(packageRoot, 'dist', bundle.output);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${sections.join('\n\n')}\n`);
}
