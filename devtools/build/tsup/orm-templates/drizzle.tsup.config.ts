import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  minify: false,
  splitting: false,
  bundle: true,
  treeshake: true,
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
    options.keepNames = true;
  },
  onSuccess: async () => {
    console.log('✅ Drizzle template build completed');
    console.log('🔄 Generating Drizzle schemas...');
  },
});
