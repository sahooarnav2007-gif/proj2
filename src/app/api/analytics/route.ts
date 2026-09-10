import { NextResponse } from 'next/server';
import { 
  MAHARASHTRA_DISTRICTS, 
  TRAINING_PROVIDERS, 
  SECTOR_OUTCOMES, 
  LONGITUDINAL_COHORT_TRENDS,
  SKILL_GAP_NLP_TOPICS 
} from '@/data/mockData';

// GET /api/analytics - Aggregated statewide metrics for MSIS and research portals.
// Optional filters: ?district= | &region= | &tier= | &sector=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtFilter = searchParams.get('district');
  const regionFilter = searchParams.get('region');
  const tierFilter = searchParams.get('tier');
  const sectorFilter = searchParams.get('sector');

  const scrapedDistricts = MAHARASHTRA_DISTRICTS.filter((d) => {
    if (districtFilter && d.district.toLowerCase() !== districtFilter.toLowerCase()) return false;
    if (regionFilter && d.region !== regionFilter) return false;
    if (tierFilter && d.tier !== tierFilter) return false;
    return true;
  });

  const scrapedSectors = SECTOR_OUTCOMES.filter((s) =>
    !sectorFilter || s.sector.toLowerCase() === sectorFilter.toLowerCase()
  );

  const pool = scrapedDistricts.length > 0 ? scrapedDistricts : MAHARASHTRA_DISTRICTS;

  const totalTrained = pool.reduce((acc, d) => acc + d.totalTrained, 0);
  const totalCertified = pool.reduce((acc, d) => acc + d.totalCertified, 0);
  const avgRetention6M = pool.reduce((acc, d) => acc + d.placedAt6M, 0) / pool.length;
  const avgRetention12M = pool.reduce((acc, d) => acc + d.placedAt12M, 0) / pool.length;
  const avgRetention24M = pool.reduce((acc, d) => acc + d.placedAt24M, 0) / pool.length;
  const avgWageMultiplier = pool.reduce((acc, d) => acc + d.wageMultiplier, 0) / pool.length;
  const avgTrustScore = pool.reduce((acc, d) => acc + d.triangulatedTrustAvg, 0) / pool.length;

  return NextResponse.json({
    success: true,
    filtersApplied: {
      district: districtFilter ?? null,
      region: regionFilter ?? null,
      tier: tierFilter ?? null,
      sector: sectorFilter ?? null,
      districtCount: scrapedDistricts.length,
    },
    statewideSummary: {
      totalTrainedLongitudinal: totalTrained,
      totalCertified,
      certificationRate: `${((totalCertified / Math.max(totalTrained, 1)) * 100).toFixed(1)}%`,
      avgRetention6M: `${avgRetention6M.toFixed(1)}%`,
      avgRetention12M: `${avgRetention12M.toFixed(1)}%`,
      avgRetention24M: `${avgRetention24M.toFixed(1)}%`,
      avgWageMultiplier: `${avgWageMultiplier.toFixed(2)}x`,
      avgTriangulationTrustScore: `${avgTrustScore.toFixed(1)}%`,
      privacyCompliance: 'DPDP Act 2023 Compliant'
    },
    districts: scrapedDistricts,
    trainingProviders: TRAINING_PROVIDERS,
    sectors: scrapedSectors.length > 0 ? scrapedSectors : SECTOR_OUTCOMES,
    cohortTrends: LONGITUDINAL_COHORT_TRENDS,
    nlpSkillGaps: SKILL_GAP_NLP_TOPICS
  });
}