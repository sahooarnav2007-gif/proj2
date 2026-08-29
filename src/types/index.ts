export type Role = 'state_admin' | 'training_provider' | 'employer' | 'trainee' | 'simulators';

export type Language = 'en' | 'mr' | 'hi';

export type EmploymentStatus = 
  | 'employed_formal' 
  | 'employed_informal' 
  | 'self_employed' 
  | 'apprentice' 
  | 'unemployed_seeking' 
  | 'higher_education' 
  | 'dropped_out';

export type VerificationStatus = 'verified_triangulated' | 'employer_verified' | 'epfo_verified' | 'self_reported' | 'pending_verification' | 'disputed';

export interface LongitudinalRecord {
  month: 3 | 6 | 12 | 24 | 36;
  timestamp: string;
  status: EmploymentStatus;
  companyName?: string;
  designation?: string;
  monthlySalary?: number;
  salarySlipUrl?: string;
  epfoUanMatched?: boolean;
  udyamRegistrationNo?: string;
  verificationStatus: VerificationStatus;
  trustScore: number; // 0 - 100%
  channelUsed: 'whatsapp' | 'ivr_call' | 'sms_link' | 'pwa_portal' | 'employer_api';
  notes?: string;
  attritionRiskScore?: number; // 0 - 100%
}

export interface Trainee {
  id: string;
  pseudonymizedToken: string; // DPDP compliant token
  fullName: string;
  maskedAadhaar: string; // e.g. XXXXXXXX4521
  mobile: string;
  email: string;
  district: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  education: string;
  trainingProviderId: string;
  trainingProviderName: string;
  courseId: string;
  courseName: string;
  sector: string;
  cohort: string;
  enrolmentDate: string;
  certificationDate: string;
  initialStipend: number;
  currentStatus: EmploymentStatus;
  currentSalary: number;
  currentEmployer?: string;
  currentDesignation?: string;
  currentLocation?: string;
  overallTrustScore: number;
  longitudinalTimeline: LongitudinalRecord[];
  skillCoins: number;
  activeConsent: {
    placementTracking: boolean;
    wageResearchAnonymized: boolean;
    employerDirectMatching: boolean;
    epfoAadhaarTriangulation: boolean;
    lastConsentDate: string;
    consentToken: string;
  };
  attritionRisk: {
    score: number; // 0-100
    level: 'Low' | 'Moderate' | 'High' | 'Critical';
    primaryRiskFactor: string;
    recommendedIntervention: string;
  };
  feedback?: {
    courseRelevanceScore: number; // 1-5
    skillGapsIdentified: string[];
    comments: string;
  };
}

export interface DistrictMetric {
  district: string;
  region: 'Konkan' | 'Pune' | 'Nashik' | 'Aurangabad' | 'Amravati' | 'Nagpur';
  totalTrained: number;
  totalCertified: number;
  placedAt6M: number; // percentage
  placedAt12M: number; // percentage
  placedAt24M: number; // percentage
  avgInitialSalary: number;
  avgCurrentSalary: number;
  wageMultiplier: number;
  selfEmploymentRate: number; // percentage
  triangulatedTrustAvg: number; // percentage
  topSectors: string[];
  activeTPCount: number;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Aspirational/Tribal';
}

export interface TrainingProviderMetric {
  id: string;
  name: string;
  district: string;
  rating: number; // 1.0 to 5.0
  totalTrained: number;
  totalCertified: number;
  retentionAt6M: number;
  retentionAt12M: number;
  retentionAt24M: number;
  avgWageHike: number; // e.g. 1.9x
  employerSatisfaction: number; // 1-100%
  followUpResponseRate: number; // percentage
  triangulationTrustRate: number; // percentage
  status: 'A+' | 'A' | 'B' | 'Needs Review';
  topCourses: string[];
}

export interface SectorOutcome {
  sector: string;
  totalTrained: number;
  retentionAt12M: number;
  avgStartingSalary: number;
  avgSalary12M: number;
  avgSalary24M: number;
  wageGrowthPct: number;
  formalRatio: number;
  selfEmploymentRatio: number;
  topSkillGaps: string[];
}

export interface EmployerVerificationItem {
  id: string;
  traineeId: string;
  traineeName: string;
  maskedAadhaar: string;
  courseName: string;
  trainingProviderName: string;
  claimedDesignation: string;
  claimedSalary: number;
  claimedJoinDate: string;
  claimedUAN?: string;
  verificationStatus: 'Pending' | 'Verified' | 'Disputed' | 'Exited';
  triangulationMatchScore: number;
  hrRemarks?: string;
}

export interface AttritionPredictionInput {
  sector: string;
  monthlySalary: number;
  commuteKm: number;
  shiftType: 'Day' | 'Night' | 'Rotational';
  trainingRelevanceScore: number; // 1-5
  isInformal: boolean;
  monthsInJob: number;
  district: string;
}
