import { describe, it, expect } from 'vitest';
import { calculateAttritionRisk } from '@/lib/attritionScore';
import type { AttritionPredictionInput } from '@/types';

const base: AttritionPredictionInput = {
  sector: 'Automotive & EV',
  district: 'Pune',
  monthlySalary: 25000,
  commuteKm: 10,
  trainingRelevanceScore: 4,
  isInformal: false,
  shiftType: 'Day',
  monthsInJob: 12,
};

describe('calculateAttritionRisk', () => {
  it('returns a clamped score within 5..95', () => {
    const low = calculateAttritionRisk({ ...base, monthlySalary: 100000, commuteKm: 0, trainingRelevanceScore: 5, monthsInJob: 36 });
    const high = calculateAttritionRisk({ ...base, monthlySalary: 8000, commuteKm: 40, trainingRelevanceScore: 1, isInformal: true, shiftType: 'Night', monthsInJob: 1 });
    expect(low.score).toBe(5);
    expect(high.score).toBe(95);
  });

  it('flags a stressed informal night-shift new joiner as Critical', () => {
    const r = calculateAttritionRisk({
      ...base,
      monthlySalary: 14000,
      commuteKm: 35,
      trainingRelevanceScore: 2,
      isInformal: true,
      shiftType: 'Night',
      monthsInJob: 2,
    });
    expect(r.level).toBe('Critical');
    expect(r.score).toBeGreaterThanOrEqual(75);
    expect(r.intervention).toContain('URGENT');
  });

  it('rates a long-tenure formal employee as Low', () => {
    const r = calculateAttritionRisk({ ...base, monthsInJob: 24 });
    expect(r.level).toBe('Low');
    expect(r.score).toBeLessThan(30);
  });

  it('rates a long-commute job as High', () => {
    const r = calculateAttritionRisk({ ...base, commuteKm: 35, isInformal: true, monthsInJob: 6 });
    expect(r.level).toBe('High');
    expect(r.score).toBeGreaterThanOrEqual(50);
    expect(r.score).toBeLessThan(75);
  });

  it('rates a moderate-risk profile as Moderate', () => {
    const r = calculateAttritionRisk({ ...base, commuteKm: 15, trainingRelevanceScore: 3, monthsInJob: 6 });
    expect(r.level).toBe('Moderate');
    expect(r.score).toBeGreaterThanOrEqual(30);
    expect(r.score).toBeLessThan(50);
  });
});