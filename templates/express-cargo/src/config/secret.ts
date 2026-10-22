const MIN_SECRET_LENGTH = 32;
const INSECURE_SECRET_VALUES = new Set(['secret', 'changeme', 'your-secret-key', 'test-secret-key']);
const INSECURE_SECRET_FRAGMENTS = ['change-this', 'replace-me', 'your-secret'];

export function isSecureSecret(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.length >= MIN_SECRET_LENGTH &&
    !INSECURE_SECRET_VALUES.has(normalized) &&
    !INSECURE_SECRET_FRAGMENTS.some((fragment) => normalized.includes(fragment))
  );
}
