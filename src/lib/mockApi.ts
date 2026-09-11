import { MAHARASHTRA_DISTRICTS, SECTOR_OUTCOMES, EMPLOYER_VERIFICATION_QUEUE } from '@/data/mockData';
import { calculateAttritionRisk } from '@/lib/attritionScore';
import type { AttritionPredictionInput, VerificationStatus } from '@/types';

// Client-side "backend" simulation.
// Every function below mirrors the wire contract of a former /api/* route but
// runs entirely in the browser — there is no server, no database, no network.
// The small latency keeps loading spinners honest during the live demo.

const LATENCY_MS = 320;

function withLatency<T>(value: T, ms: number = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function apiError(message: string): never {
  throw new Error(message);
}

function isoDate(): string {
  return new Date().toISOString().split('T')[0];
}

export interface AnalyticsParams {
  district?: string;
  region?: string;
  tier?: string;
  sector?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  filtersApplied: {
    district: string | null;
    region: string | null;
    tier: string | null;
    sector: string | null;
    districtCount: number;
  };
  statewideSummary: {
    totalTrainedLongitudinal: number;
    totalCertified: number;
    certificationRate: string;
    avgRetention6M: string;
    avgRetention12M: string;
    avgRetention24M: string;
    avgWageMultiplier: string;
    avgTriangulationTrustScore: string;
    privacyCompliance: string;
  };
  districts: typeof MAHARASHTRA_DISTRICTS;
  trainingProviders: unknown[];
  sectors: typeof SECTOR_OUTCOMES;
  cohortTrends: unknown[];
  nlpSkillGaps: unknown[];
}

// GET /api/analytics equivalent — optional ?district= &region= &tier= &sector=
export function fetchAnalytics(params: AnalyticsParams = {}): Promise<AnalyticsResponse> {
  const filteredDistricts = MAHARASHTRA_DISTRICTS.filter((d) => {
    if (params.district && d.district.toLowerCase() !== params.district.toLowerCase()) return false;
    if (params.region && d.region !== params.region) return false;
    if (params.tier && d.tier !== params.tier) return false;
    return true;
  });

  const filteredSectors = SECTOR_OUTCOMES.filter((s) =>
    !params.sector || s.sector.toLowerCase() === params.sector.toLowerCase()
  );

  const pool = filteredDistricts.length > 0 ? filteredDistricts : MAHARASHTRA_DISTRICTS;

  const totalTrained = pool.reduce((acc, d) => acc + d.totalTrained, 0);
  const totalCertified = pool.reduce((acc, d) => acc + d.totalCertified, 0);
  const avg = (pick: (d: typeof pool[number]) => number) =>
    pool.reduce((acc, d) => acc + pick(d), 0) / pool.length;

  return withLatency({
    success: true,
    filtersApplied: {
      district: params.district ?? null,
      region: params.region ?? null,
      tier: params.tier ?? null,
      sector: params.sector ?? null,
      districtCount: filteredDistricts.length,
    },
    statewideSummary: {
      totalTrainedLongitudinal: totalTrained,
      totalCertified,
      certificationRate: `${((totalCertified / Math.max(totalTrained, 1)) * 100).toFixed(1)}%`,
      avgRetention6M: `${avg((d) => d.placedAt6M).toFixed(1)}%`,
      avgRetention12M: `${avg((d) => d.placedAt12M).toFixed(1)}%`,
      avgRetention24M: `${avg((d) => d.placedAt24M).toFixed(1)}%`,
      avgWageMultiplier: `${avg((d) => d.wageMultiplier).toFixed(2)}x`,
      avgTriangulationTrustScore: `${avg((d) => d.triangulatedTrustAvg).toFixed(1)}%`,
      privacyCompliance: 'DPDP Act 2023 Compliant',
    },
    districts: filteredDistricts,
    trainingProviders: [],
    sectors: filteredSectors.length > 0 ? filteredSectors : SECTOR_OUTCOMES,
    cohortTrends: [],
    nlpSkillGaps: [],
  });
}

export interface ConsentInput {
  traineeId: string;
  placementTracking?: boolean;
  wageResearchAnonymized?: boolean;
  employerDirectMatching?: boolean;
  epfoAadhaarTriangulation?: boolean;
  action?: 'grant' | 'revoke';
}

export interface ConsentResponse {
  success: boolean;
  action: string;
  traineeId: string;
  consentToken: string;
  ledgerHash: string;
  timestamp: string;
  activePermissions: {
    placementTracking: boolean;
    wageResearchAnonymized: boolean;
    employerDirectMatching: boolean;
    epfoAadhaarTriangulation: boolean;
  };
  dpdpComplianceStatus: string;
  auditNotice: string;
}

// POST /api/consent equivalent — DPDP Act 2023 consent ledger & tokenization
export async function submitConsent(input: ConsentInput): Promise<ConsentResponse> {
  if (!input.traineeId) apiError('Missing traineeId');

  const {
    placementTracking = true,
    wageResearchAnonymized = true,
    employerDirectMatching = true,
    epfoAadhaarTriangulation = true,
    action = 'grant',
  } = input;

  const consentToken = `DPDP-TOKEN-${Date.now().toString(36).toUpperCase()}`;
  const ledgerHash = `LEDGER-SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

  return withLatency({
    success: true,
    action,
    traineeId: input.traineeId,
    consentToken,
    ledgerHash,
    timestamp: new Date().toISOString(),
    activePermissions: {
      placementTracking,
      wageResearchAnonymized,
      employerDirectMatching,
      epfoAadhaarTriangulation,
    },
    dpdpComplianceStatus: action === 'revoke' ? 'REVOKED_AUDITED' : 'ACTIVE_CONSENT_GRANTED',
    auditNotice: 'This transaction is cryptographically logged in compliance with the Digital Personal Data Protection Act 2023.',
  });
}

export interface TelemetryInput {
  traineeId?: string;
  month?: number;
  status?: string;
  monthlySalary?: number;
  salary?: number;
  designation?: string;
  companyName?: string;
  company?: string;
  channelUsed?: string;
  channel?: string;
}

export interface TelemetryResponse {
  success: boolean;
  message: string;
  record: {
    month: number;
    timestamp: string;
    status: string;
    monthlySalary: number;
    designation: string;
    companyName: string;
    channelUsed: string;
    verificationStatus: VerificationStatus;
    trustScore: number;
    epfoUanMatched: boolean;
  };
  skillCoinsAwarded: number;
  trustScore: number;
  dpdpAuditToken: string;
}

// POST /api/telemetry equivalent — multi-channel outcome ingestion
export async function ingestTelemetry(input: TelemetryInput): Promise<TelemetryResponse> {
  if (!input.traineeId || !input.month || !input.status) {
    apiError('Missing required fields: traineeId, month, status');
  }

  const resolvedSalary = Number(input.monthlySalary ?? input.salary) || 0;

  return withLatency({
    success: true,
    message: `Telemetry outcome for Month ${input.month} successfully ingested and triangulated.`,
    record: {
      month: Number(input.month),
      timestamp: isoDate(),
      status: input.status!,
      monthlySalary: resolvedSalary,
      designation: input.designation || 'Specialist',
      companyName: input.companyName || input.company || 'Verified Employer',
      channelUsed: input.channelUsed || input.channel || 'whatsapp',
      verificationStatus: 'verified_triangulated',
      trustScore: 98,
      epfoUanMatched: true,
    },
    skillCoinsAwarded: 50,
    trustScore: 98,
    dpdpAuditToken: `AUD-${Date.now()}`,
  });
}

export interface VerificationInput {
  action: 'lookup' | 'confirm' | 'dispute';
  itemId?: string;
  identifier?: string;
  type?: 'uan' | 'udyam' | 'trainee';
}

export interface VerificationResponse {
  success: boolean;
  status?: string;
  identifier?: string;
  establishmentName?: string;
  establishmentId?: string;
  lastContributionMonth?: string;
  wageBracket?: string;
  tenureMonths?: string;
  trustScore?: number;
  dpdpHash?: string;
  triangulationSignal?: string;
  itemId?: string;
  newStatus?: 'Verified' | 'Disputed';
  triangulationMatchScore?: number;
  remarks?: string;
}

// POST /api/verify equivalent — registry lookup (EPFO/Udyam/NAPS) or confirm/dispute
export async function resolveVerification(input: VerificationInput): Promise<VerificationResponse> {
  if (input.action === 'lookup') {
    if (input.type === 'uan') {
      return withLatency({
        success: true,
        status: 'ACTIVE_VERIFIED',
        identifier: `${input.identifier || '100984128912'} (Universal Account Number)`,
        establishmentName: 'Tata Motors Passenger Vehicles Ltd',
        establishmentId: 'MH/PUN/0014298/000',
        lastContributionMonth: 'January 2026',
        wageBracket: '₹30,000 - ₹35,000 / month',
        tenureMonths: '22 Months Continuous',
        trustScore: 98,
        dpdpHash: `SHA256-${Date.now()}`,
        triangulationSignal: 'POSITIVE_FORMAL_EMPLOYMENT',
      });
    }

    if (input.type === 'udyam') {
      return withLatency({
        success: true,
        status: 'ACTIVE_VERIFIED',
        identifier: `${input.identifier || 'UDYAM-MH-23-0089124'} (Ministry of MSME)`,
        establishmentName: 'M/s Jadhav Solar & Electrical Services',
        establishmentId: 'UDYAM-MH-23-0089124',
        lastContributionMonth: 'GST Returns Filed Q3 2025',
        wageBracket: 'Micro Enterprise (₹2.5L - ₹5L Annual Turnover)',
        tenureMonths: '18 Months Active',
        trustScore: 94,
        dpdpHash: `SHA256-${Date.now()}`,
        triangulationSignal: 'POSITIVE_SELF_EMPLOYMENT',
      });
    }

    return withLatency({
      success: true,
      status: 'ACTIVE_VERIFIED',
      identifier: `${input.identifier || 'NAPS-MH-2024-998'} (NAPS Registry)`,
      establishmentName: 'Mahindra & Mahindra Ltd',
      establishmentId: 'NAPS-CONTRACT-MH-2024-998',
      lastContributionMonth: 'Dec 2025 DBT Stipend Credited',
      wageBracket: '₹14,000 / month',
      tenureMonths: '11 Months Active',
      trustScore: 96,
      dpdpHash: `SHA256-${Date.now()}`,
      triangulationSignal: 'POSITIVE_APPRENTICESHIP',
    });
  }

  if (input.action === 'confirm' || input.action === 'dispute') {
    const match = EMPLOYER_VERIFICATION_QUEUE.find((item) => item.id === input.itemId);
    return withLatency({
      success: true,
      itemId: input.itemId,
      newStatus: input.action === 'confirm' ? 'Verified' : 'Disputed',
      triangulationMatchScore: input.action === 'confirm' ? 100 : 40,
      remarks: input.action === 'confirm'
        ? 'Verified by HR Manager via Skill Sync Employer Gateway.'
        : 'Discrepancy reported: Candidate is not on active payroll.',
    });
  }

  apiError('Invalid action parameter');
}

export interface AttritionApiResponse {
  success: boolean;
  modelVersion: string;
  rocAuc: number;
  inferenceTimestamp: string;
  prediction: {
    riskScorePercentage: number;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    daysHorizon: number;
    primaryFactors: {
      wageToCommuteRatio: string;
      shiftFriction: string;
      contractType: string;
      relevance: string;
    };
    recommendedCounselorIntervention: string;
  };
}

// POST /api/ai/predict-attrition equivalent — Random Forest inference
export function predictAttrition(input: AttritionPredictionInput): Promise<AttritionApiResponse> {
  const result = calculateAttritionRisk(input);

  return withLatency({
    success: true,
    modelVersion: 'SkillSync-RF-Classifier-v2.6',
    rocAuc: 0.912,
    inferenceTimestamp: new Date().toISOString(),
    prediction: {
      riskScorePercentage: result.score,
      riskLevel: result.level,
      daysHorizon: 90,
      primaryFactors: {
        wageToCommuteRatio: (input.monthlySalary / (input.commuteKm || 1)).toFixed(1),
        shiftFriction: input.shiftType,
        contractType: input.isInformal ? 'Informal / Contract' : 'Formal EPFO',
        relevance: `${input.trainingRelevanceScore}/5 Stars`,
      },
      recommendedCounselorIntervention: result.intervention,
    },
  });
}

// GET /api/verify equivalent — pending verification queue
export function fetchVerificationQueue(): Promise<{ success: boolean; totalPending: number; queue: typeof EMPLOYER_VERIFICATION_QUEUE }> {
  return withLatency({
    success: true,
    totalPending: EMPLOYER_VERIFICATION_QUEUE.filter((q) => q.verificationStatus === 'Pending').length,
    queue: EMPLOYER_VERIFICATION_QUEUE,
  });
}