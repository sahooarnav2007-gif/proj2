import { describe, it, expect } from 'vitest';
import { GET as analyticsGET } from '@/app/api/analytics/route';
import { POST as consentPOST } from '@/app/api/consent/route';
import { POST as telemetryPOST, GET as telemetryGET } from '@/app/api/telemetry/route';
import { POST as verifyPOST, GET as verifyGET } from '@/app/api/verify/route';
import { POST as predictPOST } from '@/app/api/ai/predict-attrition/route';

async function read(res: Response) {
  return { status: res.status, body: await res.json() };
}

function api(method: string, url: string, body?: unknown) {
  return new Request(url, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GET /api/analytics', () => {
  it('returns the full 36-district aggregate with no filters', async () => {
    const { status, body } = await read(await analyticsGET(api('GET', 'http://localhost/api/analytics')));
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.filtersApplied.districtCount).toBe(36);
    expect(body.statewideSummary.privacyCompliance).toContain('DPDP');
  });

  it('filters to 5 districts for region=Pune', async () => {
    const { body } = await read(await analyticsGET(api('GET', 'http://localhost/api/analytics?region=Pune')));
    expect(body.filtersApplied.districtCount).toBe(5);
    expect(body.filtersApplied.region).toBe('Pune');
  });

  it('rejects an invalid region with 400', async () => {
    const { status, body } = await read(await analyticsGET(api('GET', 'http://localhost/api/analytics?region=Bogus')));
    expect(status).toBe(400);
    expect(body.error).toContain('Invalid region');
  });

  it('rejects an invalid tier with 400', async () => {
    const { status } = await read(await analyticsGET(api('GET', 'http://localhost/api/analytics?tier=Tier 9')));
    expect(status).toBe(400);
  });
});

describe('POST /api/consent', () => {
  it('mints a DPDP token and ledger hash', async () => {
    const { status, body } = await read(await consentPOST(api('POST', 'http://localhost/api/consent', { traineeId: 'TR-101' })));
    expect(status).toBe(200);
    expect(body.consentToken).toMatch(/^DPDP-TOKEN-/);
    expect(body.ledgerHash).toMatch(/^LEDGER-SHA256-/);
    expect(body.dpdpComplianceStatus).toBe('ACTIVE_CONSENT_GRANTED');
  });

  it('returns 400 for a missing traineeId', async () => {
    const { status, body } = await read(await consentPOST(api('POST', 'http://localhost/api/consent', {})));
    expect(status).toBe(400);
    expect(body.error).toBe('Missing traineeId');
  });

  it('returns 400 for an invalid action', async () => {
    const { status } = await read(await consentPOST(api('POST', 'http://localhost/api/consent', { traineeId: 'TR-1', action: 'delete' })));
    expect(status).toBe(400);
  });
});

describe('POST /api/telemetry', () => {
  it('ingests a valid outcome and awards coins', async () => {
    const { status, body } = await read(await telemetryPOST(api('POST', 'http://localhost/api/telemetry', {
      traineeId: 'TR-101', month: 24, status: 'employed', monthlySalary: 26000,
    })));
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.skillCoinsAwarded).toBe(50);
    expect(body.record.verificationStatus).toBe('verified_triangulated');
    expect(body.ingestionCount).toBeGreaterThan(0);
  });

  it('accepts alias field names', async () => {
    const { body } = await read(await telemetryPOST(api('POST', 'http://localhost/api/telemetry', {
      traineeId: 'TR-101', month: 24, status: 'employed', salary: 31000, company: 'Tata Motors', channel: 'ivr',
    })));
    expect(body.record.monthlySalary).toBe(31000);
    expect(body.record.companyName).toBe('Tata Motors');
    expect(body.record.channelUsed).toBe('ivr');
  });

  it('returns 400 for an out-of-range month', async () => {
    const { status } = await read(await telemetryPOST(api('POST', 'http://localhost/api/telemetry', {
      traineeId: 'TR-101', month: 0, status: 'employed',
    })));
    expect(status).toBe(400);
  });

  it('returns the trainee roster on GET', async () => {
    const { status, body } = await read(await telemetryGET(api('GET', 'http://localhost/api/telemetry')));
    expect(status).toBe(200);
    expect(body.totalRecords).toBeGreaterThan(0);
  });
});

describe('POST /api/verify', () => {
  it('looks up a UAN in the EPFO registry', async () => {
    const { status, body } = await read(await verifyPOST(api('POST', 'http://localhost/api/verify', { action: 'lookup', type: 'uan', identifier: '100984128912' })));
    expect(status).toBe(200);
    expect(body.status).toBe('ACTIVE_VERIFIED');
    expect(body.triangulationSignal).toBe('POSITIVE_FORMAL_EMPLOYMENT');
  });

  it('returns 400 for confirm without itemId', async () => {
    const { status } = await read(await verifyPOST(api('POST', 'http://localhost/api/verify', { action: 'confirm' })));
    expect(status).toBe(400);
  });

  it('returns 400 for an invalid action', async () => {
    const { status } = await read(await verifyPOST(api('POST', 'http://localhost/api/verify', { action: 'yank' })));
    expect(status).toBe(400);
  });

  it('returns the pending queue on GET', async () => {
    const { status, body } = await read(await verifyGET());
    expect(status).toBe(200);
    expect(body.totalPending).toBeGreaterThanOrEqual(0);
  });
});

describe('POST /api/ai/predict-attrition', () => {
  it('returns model metadata and a valid prediction', async () => {
    const { status, body } = await read(await predictPOST(api('POST', 'http://localhost/api/ai/predict-attrition', {
      sector: 'Automotive & EV', monthlySalary: 18000, commuteKm: 12, shiftType: 'Day',
      trainingRelevanceScore: 4, isInformal: false, monthsInJob: 6, district: 'Pune',
    })));
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.modelVersion).toBe('SkillSync-RF-Classifier-v2.6');
    expect(body.rocAuc).toBe(0.912);
    expect(typeof body.prediction.riskScorePercentage).toBe('number');
  });

  it('rejects unrealistic salary signals with 400', async () => {
    const { status, body } = await read(await predictPOST(api('POST', 'http://localhost/api/ai/predict-attrition', { monthlySalary: 10 })));
    expect(status).toBe(400);
    expect(body.error).toContain('monthlySalary');
  });
});