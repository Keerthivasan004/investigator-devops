import * as esbuild from 'esbuild';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function bundle() {
  console.log('Bundling unified CLI for distribution...');
  const entryPoint = path.join(rootDir, 'apps/cli/src/index.ts');
  const outfile = path.join(rootDir, 'apps/cli/dist/index.js');

  await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    outfile,
    sourcemap: true,
    logLevel: 'info'
  });

  console.log('✔ Standalone distribution bundle generated at:', outfile);
}

bundle().catch((err) => {
  console.error('Bundle failed:', err);
  process.exit(1);
});
