// esbuild.config.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'], // Main TS file
  bundle: true,
  minify: true,
  platform: 'node', // For Node.js apps
  target: 'node20', // Target Node.js version
  outfile: 'dist/index.js', // Output file
  sourcemap: true, // Enable source maps
  tsconfig: './tsconfig.json', // Use TS config
}).catch(() => process.exit(1));