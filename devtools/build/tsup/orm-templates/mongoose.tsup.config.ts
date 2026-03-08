import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  minify: false,
  splitting: false,
  treeshake: true,
  // Mongoose 특화 설정
  external: ['mongoose'],
  noExternal: [],
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
      '@models': './src/models',
      '@repositories': './src/repositories',
      '@routes': './src/routes',
      '@services': './src/services',
      '@utils': './src/utils',
    };
    options.keepNames = true;
    options.platform = 'node';
  },
  onSuccess: async () => {
    console.log('✅ Mongoose template build completed');
    console.log('📦 MongoDB schemas ready');
  },
});
