import { describe, expect, it } from 'vitest';
import { isSecureSecret } from '@config/secret';

describe('secret validation', () => {
  it('rejects weak and documented placeholder secrets', () => {
    expect(isSecureSecret('your-secret-key')).toBe(false);
    expect(isSecureSecret('your-super-secret-jwt-key-change-this-in-production')).toBe(false);
  });

  it('accepts a sufficiently long non-placeholder secret', () => {
    expect(isSecureSecret('f9c8f4b2e658de657d903c9f824a37ab60b9348795fdad63c966df7d19bb8a2c')).toBe(true);
  });
});
