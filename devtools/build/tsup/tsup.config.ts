import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'node18',
  minify: false,
  bundle: true,
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
      '@config': './src/config',
      '@controllers': './src/controllers',
      '@dtos': './src/dtos',
      '@entities': './src/entities',
      '@exceptions': './src/exceptions',
      '@interfaces': './src/interfaces',
      '@middlewares': './src/middlewares',
      '@repositories': './src/repositories',
      '@routes': './src/routes',
      '@services': './src/services',
      '@utils': './src/utils',
    };
  },
});
