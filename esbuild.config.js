require('esbuild').build({
    entryPoints: ['src/main.tsx'],
    bundle: true,
    outfile: 'dist/index.js',
    minify: true,
    sourcemap: true,
    define: { 'process.env.NODE_ENV': '"production"' },
  }).catch(() => process.exit(1));
  