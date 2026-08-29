import { NextResponse } from 'next/server';
import { 
  MAHARASHTRA_DISTRICTS, 
  TRAINING_PROVIDERS, 
  SECTOR_OUTCOMES, 
  LONGITUDINAL_COHORT_TRENDS,
  SKILL_GAP_NLP_TOPICS 
} from '@/data/mockData';

// GET /api/analytics - Aggregated statewide metrics for MSIS and research portals
export async function GET() {
  const totalTrained = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.totalTrained, 0);
  const totalCertified = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.totalCertified, 0);
  const avgRetention6M = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.placedAt6M, 0) / MAHARASHTRA_DISTRICTS.length;
  const avgRetention12M = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.placedAt12M, 0) / MAHARASHTRA_DISTRICTS.length;
  const avgRetention24M = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.placedAt24M, 0) / MAHARASHTRA_DISTRICTS.length;
  const avgWageMultiplier = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.wageMultiplier, 0) / MAHARASHTRA_DISTRICTS.length;
  const avgTrustScore = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.triangulatedTrustAvg, 0) / MAHARASHTRA_DISTRICTS.length;

  return NextResponse.json({
    success: true,
    statewideSummary: {
      totalTrainedLongitudinal: totalTrained,
      totalCertified,
      certificationRate: `${((totalCertified / totalTrained) * 100).toFixed(1)}%`,
      avgRetention6M: `${avgRetention6M.toFixed(1)}%`,
      avgRetention12M: `${avgRetention12M.toFixed(1)}%`,
      avgRetention24M: `${avgRetention24M.toFixed(1)}%`,
      avgWageMultiplier: `${avgWageMultiplier.toFixed(2)}x`,
      avgTriangulationTrustScore: `${avgTrustScore.toFixed(1)}%`,
      privacyCompliance: 'DPDP Act 2023 Compliant'
    },
    districts: MAHARASHTRA_DISTRICTS,
    trainingProviders: TRAINING_PROVIDERS,
    sectors: SECTOR_OUTCOMES,
    cohortTrends: LONGITUDINAL_COHORT_TRENDS,
    nlpSkillGaps: SKILL_GAP_NLP_TOPICS
  });
}
