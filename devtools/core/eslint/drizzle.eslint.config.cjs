const tseslint = require('typescript-eslint');
const globals = require('globals');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'dist/',
      'coverage/',
      'logs/',
      'node_modules/',
      '*.config.js',
      '*.config.ts',
      '.env',
      '.env.*',
      '!.eslintrc.js',
    ],
  },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': ['warn', { allow: ['error', 'log'] }], // logger 초기화와 에러 허용
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 테스트에서는 any 타입 허용
      'no-console': 'off', // 테스트에서는 console 사용 허용
    },
  },
];