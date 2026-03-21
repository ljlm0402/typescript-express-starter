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
  // MikroORM 특화 설정
  external: ['@mikro-orm/core', '@mikro-orm/postgresql', 'reflect-metadata'],
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
      '@repositories': './src/repositories',
      '@routes': './src/routes',
      '@services': './src/services',
      '@utils': './src/utils',
    };
    options.keepNames = true;
    options.metafile = true;
  },
  banner: {
    js: 'import "reflect-metadata";',
  },
  onSuccess: async () => {
    console.log('✅ MikroORM template build completed');
    console.log('🔄 MikroORM metadata processed');
  },
});
