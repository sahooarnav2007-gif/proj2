// Deterministic content fingerprint for demo credentials.
// Uses the Web Crypto SHA-256 API when available (secure contexts /
// localhost) and falls back to a fast 32-bit FNV-1a hash so the same
// utility still works over plain-HTTP LAN scans during the live demo.
export async function sha256Hex(input: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
      return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // fall through to FNV-1a below
  }
  return fnv1aHex(input);
}

export function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(16, '0').repeat(4);
}