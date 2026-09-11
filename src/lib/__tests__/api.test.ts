import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchAnalytics, submitConsent, ingestTelemetry, resolveVerification, predictAttrition } from '@/lib/api';

describe('dual-mode data layer (live backend with offline fallback)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('hits the real /api/analytics when the backend is reachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, fromBackend: true }), { status: 200 }),
    ));
    const res = (await fetchAnalytics({ region: 'Pune' })) as unknown as { fromBackend: boolean; success: boolean };
    expect(res.fromBackend).toBe(true);
    expect((fetch as any).mock.calls[0][0]).toContain('/api/analytics?region=Pune');
  });

  it('falls back to the simulation when the backend is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fetch failed')));
    const res = await fetchAnalytics({ district: 'Pune' });
    expect(res.filtersApplied.districtCount).toBe(1);
    expect(res.districts[0].district).toBe('Pune');
  });

  it('falls back to the simulation when the backend returns an error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'boom' }), { status: 500 }),
    ));
    const res = await submitConsent({ traineeId: 'TR-101' });
    expect(res.success).toBe(true);
    expect(res.consentToken).toMatch(/^DPDP-TOKEN-/);
  });

  it('posts consent to the live route when reachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, consentToken: 'LIVE-TKN' }), { status: 200 }),
    ));
    const res = await submitConsent({ traineeId: 'TR-101' });
    expect(res.consentToken).toBe('LIVE-TKN');
    expect((fetch as any).mock.calls[0][0]).toBe('/api/consent');
  });

  it('telemetry, verification, and attrition wrappers exist and match mock shapes on fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const telemetry = await ingestTelemetry({ traineeId: 'TR-101', month: 24, status: 'employed', salary: 26000 });
    expect(telemetry.record.monthlySalary).toBe(26000);

    const verify = await resolveVerification({ action: 'confirm', itemId: 'VER-101' });
    expect(verify.newStatus).toBe('Verified');

    const prediction = await predictAttrition({
      sector: 'Automotive & EV',
      monthlySalary: 18000,
      commuteKm: 12,
      shiftType: 'Day',
      trainingRelevanceScore: 4,
      isInformal: false,
      monthsInJob: 6,
      district: 'Pune',
    });
    expect(prediction.modelVersion).toBe('SkillSync-RF-Classifier-v2.6');
  });
});