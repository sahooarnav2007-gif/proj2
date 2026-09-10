import { describe, it, expect } from 'vitest';
import { sha256Hex, fnv1aHex } from '@/lib/crypto';

describe('sha256Hex', () => {
  it('matches the known SHA-256 vector for the empty string', async () => {
    expect(await sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('is deterministic for the same input', async () => {
    const a = await sha256Hex('MSIS-8821|Manisha Madavi');
    const b = await sha256Hex('MSIS-8821|Manisha Madavi');
    expect(a).toBe(b);
  });

  it('differs when the credential subject changes', async () => {
    const a = await sha256Hex('MSIS-8821|Manisha Madavi');
    const b = await sha256Hex('MSIS-8822|Ramesh Patil');
    expect(a).not.toBe(b);
  });
});

describe('fnv1aHex', () => {
  it('is deterministic', () => {
    expect(fnv1aHex('abc')).toBe(fnv1aHex('abc'));
  });

  it('outputs a fixed 64-char hex string', () => {
    expect(fnv1aHex('abc')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('differs for different inputs', () => {
    expect(fnv1aHex('abc')).not.toBe(fnv1aHex('abd'));
  });
});