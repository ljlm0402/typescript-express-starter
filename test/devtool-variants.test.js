import assert from 'node:assert/strict';
import test from 'node:test';

import { getTestingVariantFolder } from '../bin/devtool-variants.js';

test('resolves testing assets by template family', () => {
  assert.equal(getTestingVariantFolder('vitest', 'default'), 'src-default');
  assert.equal(getTestingVariantFolder('jest', 'express-cargo'), 'src-default');
  assert.equal(getTestingVariantFolder('vitest', 'drizzle-postgresql'), 'src-drizzle');
});

test('rejects template families without compatible test fixtures', () => {
  assert.throws(
    () => getTestingVariantFolder('jest', 'prisma-postgresql'),
    /does not support the prisma template family yet/,
  );
  assert.throws(
    () => getTestingVariantFolder('vitest', 'mongoose-mongodb'),
    /does not support the mongoose template family yet/,
  );
});
