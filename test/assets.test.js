import assert from 'node:assert/strict';
import test from 'node:test';

import { collectAssetIssues } from '../bin/validate-assets.js';

test('active templates have complete template and devtool assets', () => {
  assert.deepEqual(collectAssetIssues(), []);
});
