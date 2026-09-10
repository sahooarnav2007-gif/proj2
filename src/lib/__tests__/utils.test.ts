import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatINR, formatPercent, cn } from '@/lib/utils';
import { apiFetch } from '@/lib/apiClient';

describe('formatINR', () => {
  it('formats lakhs in Indian digit grouping', () => {
    expect(formatINR(1234567)).toBe('₹12,34,567');
  });

  it('formats a plain salary', () => {
    expect(formatINR(26000)).toBe('₹26,000');
  });
});

describe('formatPercent', () => {
  it('appends one decimal and the percent sign', () => {
    expect(formatPercent(71.6)).toBe('71.6%');
    expect(formatPercent(91)).toBe('91.0%');
  });
});

describe('cn (class merge)', () => {
  it('merges conditional classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold');
  });
});

describe('apiFetch', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('resolves with the parsed JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 })));
    await expect(apiFetch<{ ok: boolean }>('/api/x')).resolves.toEqual({ ok: true });
  });

  it('throws the server-provided error message on a non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Missing traineeId' }), { status: 400 })));
    await expect(apiFetch('/api/x')).rejects.toThrow('Missing traineeId');
  });

  it('falls back to the status code when the error body is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })));
    await expect(apiFetch('/api/x')).rejects.toThrow('Request failed (500)');
  });

  it('sends a JSON content-type header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await apiFetch('/api/x', { method: 'POST', body: '{}' });
    expect(fetchMock).toHaveBeenCalledWith('/api/x', expect.objectContaining({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }) }));
  });
});