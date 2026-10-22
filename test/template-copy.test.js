import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldCopyTemplatePath } from '../bin/template-filter.js';

test('copies public template assets but excludes private environment files', () => {
  assert.equal(shouldCopyTemplatePath('/template/.env.example'), true);
  assert.equal(shouldCopyTemplatePath('/template/src/server.ts'), true);
  assert.equal(shouldCopyTemplatePath('/template/.env'), false);
  assert.equal(shouldCopyTemplatePath('/template/.env.development.local'), false);
  assert.equal(shouldCopyTemplatePath('/template/node_modules/package/index.js'), false);
  assert.equal(shouldCopyTemplatePath('/template/dist/server.js'), false);
});

test('evaluates ignored folders relative to the template root', () => {
  const templateRoot = '/consumer/node_modules/package/templates/default';

  assert.equal(shouldCopyTemplatePath(`${templateRoot}/src/server.ts`, templateRoot), true);
  assert.equal(
    shouldCopyTemplatePath(`${templateRoot}/node_modules/dependency/index.js`, templateRoot),
    false,
  );
});
