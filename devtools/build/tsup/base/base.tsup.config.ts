import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'], // CLI 등 추가시 여러 entry도 가능
  outDir: 'dist', // 출력 디렉토리
  format: ['cjs'], // 필요시 'esm'도 ['cjs', 'esm']
  dts: true, // 타입 선언 파일(.d.ts) 생성
  sourcemap: true, // 소스맵 생성
  clean: true, // 빌드 전 dist 폴더 정리
  target: 'es2020', // 트랜스파일 대상
  minify: false, // JS 파일을 압축(minify) 해서 더 작게 만듭니다.
  treeshake: true, //사용하지 않는 코드를 제거합니다. 기본은 true지만 명시
  // alias, swc 옵션은 tsconfig.json 기준으로 자동 적용
  // external: [], // node_modules 제외하고 싶을 때
});
