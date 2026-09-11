import { describe, it, expect } from 'vitest';
import {
  fetchAnalytics,
  submitConsent,
  ingestTelemetry,
  resolveVerification,
  predictAttrition,
  fetchVerificationQueue,
} from '@/lib/mockApi';

describe('fetchAnalytics (simulated /api/analytics)', () => {
  it('returns statewide aggregates with no filters', async () => {
    const res = await fetchAnalytics();
    expect(res.success).toBe(true);
    expect(res.filtersApplied.districtCount).toBeGreaterThan(5);
    expect(res.statewideSummary.privacyCompliance).toContain('DPDP');
    expect(res.districts.length).toBeGreaterThan(5);
  });

  it('filters districts by region and tier', async () => {
    const res = await fetchAnalytics({ region: 'Pune', tier: 'Tier 1' });
    expect(res.filtersApplied.region).toBe('Pune');
    expect(res.filtersApplied.tier).toBe('Tier 1');
    expect(res.districts.length).toBeGreaterThan(0);
    expect(res.districts.every(d => d.region === 'Pune' && d.tier === 'Tier 1')).toBe(true);
  });

  it('filters by a single district', async () => {
    const res = await fetchAnalytics({ district: 'Pune' });
    expect(res.filtersApplied.district).toBe('Pune');
    expect(res.filtersApplied.districtCount).toBe(1);
    expect(res.districts[0].district).toBe('Pune');
  });

  it('filters sectors by sector name', async () => {
    const res = await fetchAnalytics({ sector: 'Automotive & EV' });
    expect(res.filtersApplied.sector).toBe('Automotive & EV');
    expect(res.sectors.every(s => s.sector === 'Automotive & EV')).toBe(true);
  });
});

describe('submitConsent (simulated /api/consent)', () => {
  it('issues a DPDP token and ledger hash', async () => {
    const res = await submitConsent({ traineeId: 'TR-101' });
    expect(res.success).toBe(true);
    expect(res.consentToken).toMatch(/^DPDP-TOKEN-/);
    expect(res.ledgerHash).toMatch(/^LEDGER-SHA256-/);
    expect(res.dpdpComplianceStatus).toBe('ACTIVE_CONSENT_GRANTED');
    expect(res.activePermissions.placementTracking).toBe(true);
  });

  it('honours a revoke action', async () => {
    const res = await submitConsent({ traineeId: 'TR-101', action: 'revoke' });
    expect(res.dpdpComplianceStatus).toBe('REVOKED_AUDITED');
  });

  it('throws when traineeId is missing', async () => {
    await expect(submitConsent({ traineeId: '' })).rejects.toThrow('Missing traineeId');
  });
});

describe('ingestTelemetry (simulated /api/telemetry)', () => {
  it('ingests an outcome and awards coins with an audit token', async () => {
    const res = await ingestTelemetry({
      traineeId: 'TR-101',
      month: 24,
      status: 'employed',
      monthlySalary: 26000,
      channelUsed: 'whatsapp',
    });
    expect(res.success).toBe(true);
    expect(res.skillCoinsAwarded).toBe(50);
    expect(res.record.month).toBe(24);
    expect(res.record.monthlySalary).toBe(26000);
    expect(res.record.verificationStatus).toBe('verified_triangulated');
    expect(res.dpdpAuditToken).toMatch(/^AUD-/);
  });

  it('accepts alias field names (salary/company/channel)', async () => {
    const res = await ingestTelemetry({
      traineeId: 'TR-101',
      month: 24,
      status: 'employed',
      salary: 31000,
      company: 'Tata Motors',
      channel: 'ivr',
    });
    expect(res.record.monthlySalary).toBe(31000);
    expect(res.record.companyName).toBe('Tata Motors');
    expect(res.record.channelUsed).toBe('ivr');
  });

  it('throws when required fields are missing', async () => {
    await expect(ingestTelemetry({})).rejects.toThrow('Missing required fields');
  });
});

describe('resolveVerification (simulated /api/verify)', () => {
  it('looks up a UAN in the EPFO registry', async () => {
    const res = await resolveVerification({ action: 'lookup', type: 'uan', identifier: '100984128912' });
    expect(res.status).toBe('ACTIVE_VERIFIED');
    expect(res.triangulationSignal).toBe('POSITIVE_FORMAL_EMPLOYMENT');
    expect(res.trustScore).toBe(98);
  });

  it('returns the pending verification queue', async () => {
    const res = await fetchVerificationQueue();
    expect(res.success).toBe(true);
    expect(res.totalPending).toBeGreaterThanOrEqual(0);
    expect(res.queue.length).toBeGreaterThan(0);
  });

  it('confirms an item with a triangulation score of 100', async () => {
    const res = await resolveVerification({ action: 'confirm', itemId: 'VER-101' });
    expect(res.newStatus).toBe('Verified');
    expect(res.triangulationMatchScore).toBe(100);
  });

  it('throws on an invalid action', async () => {
    await expect(resolveVerification({ action: 'bogus' } as never)).rejects.toThrow('Invalid action');
  });
});

describe('predictAttrition (simulated /api/ai/predict-attrition)', () => {
  it('returns model metadata and a prediction', async () => {
    const res = await predictAttrition({
      sector: 'Automotive & EV',
      monthlySalary: 18000,
      commuteKm: 12,
      shiftType: 'Day',
      trainingRelevanceScore: 4,
      isInformal: false,
      monthsInJob: 6,
      district: 'Pune',
    });
    expect(res.success).toBe(true);
    expect(res.modelVersion).toBe('SkillSync-RF-Classifier-v2.6');
    expect(res.rocAuc).toBe(0.912);
    expect(res.prediction.daysHorizon).toBe(90);
    expect(typeof res.prediction.riskScorePercentage).toBe('number');
  });
});