import assert from 'node:assert/strict';
import test from 'node:test';

import { isVersionAtLeast, mergePackageSpecs } from '../bin/validators.js';

test('records scoped and unscoped package specifiers', () => {
  const dependencies = mergePackageSpecs(
    { typescript: '^5.9.3' },
    ['vitest@5.0.2', '@vitest/coverage-v8@5.0.2', '@types/supertest@6.0.3'],
  );

  assert.deepEqual(dependencies, {
    typescript: '^5.9.3',
    vitest: '5.0.2',
    '@vitest/coverage-v8': '5.0.2',
    '@types/supertest': '6.0.3',
  });
});

test('compares full semantic Node versions', () => {
  assert.equal(isVersionAtLeast('22.12.0', '22.12.0'), true);
  assert.equal(isVersionAtLeast('22.13.0', '22.12.0'), true);
  assert.equal(isVersionAtLeast('24.0.0', '22.12.0'), true);
  assert.equal(isVersionAtLeast('22.11.9', '22.12.0'), false);
  assert.equal(isVersionAtLeast('20.19.0', '22.12.0'), false);
});
