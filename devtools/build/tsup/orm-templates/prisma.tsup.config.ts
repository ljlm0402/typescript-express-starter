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
  external: ['@prisma/client'],
  noExternal: ['prisma'],
  onSuccess: async () => {
    console.log('✅ Prisma template build completed');
    console.log('🔄 Generating Prisma client...');
    // Prisma client 생성은 별도 스크립트에서 처리
  },
});
