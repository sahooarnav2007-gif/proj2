import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EmploymentStatus, VerificationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStatusBadgeInfo(status: EmploymentStatus): { label: string; labelMr: string; color: string; bg: string } {
  switch (status) {
    case 'employed_formal':
      return { label: 'Formal Employment (EPFO)', labelMr: 'औपचारिक रोजगार (EPFO)', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' };
    case 'employed_informal':
      return { label: 'Informal / Contract', labelMr: 'कंत्राटी / अनौपचारिक', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800' };
    case 'self_employed':
      return { label: 'Self-Employed (Udyam)', labelMr: 'स्वयंरोजगार (उद्यम)', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800' };
    case 'apprentice':
      return { label: 'Apprenticeship (NAPS)', labelMr: 'प्रशिक्षणार्थी (NAPS)', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800' };
    case 'higher_education':
      return { label: 'Higher Education', labelMr: 'उच्च शिक्षण', color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-300 dark:border-cyan-800' };
    case 'unemployed_seeking':
      return { label: 'Job Seeking / Gap', labelMr: 'नोकरी शोधत आहे', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' };
    case 'dropped_out':
      return { label: 'Dropped Out / Inactive', labelMr: 'सोडून दिले / निष्क्रिय', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800' };
    default:
      return { label: status, labelMr: status, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-300' };
  }
}

export function getVerificationBadgeInfo(status: VerificationStatus): { label: string; badgeColor: string; icon: string } {
  switch (status) {
    case 'verified_triangulated':
      return { label: 'Triangulated (100% Trust)', badgeColor: 'bg-emerald-500 text-white', icon: 'ShieldCheck' };
    case 'epfo_verified':
      return { label: 'EPFO/UAN Confirmed', badgeColor: 'bg-blue-600 text-white', icon: 'Building2' };
    case 'employer_verified':
      return { label: 'Employer Verified', badgeColor: 'bg-teal-600 text-white', icon: 'CheckCircle2' };
    case 'self_reported':
      return { label: 'Trainee Self-Reported', badgeColor: 'bg-amber-500 text-white', icon: 'UserCheck' };
    case 'disputed':
      return { label: 'Discrepancy Flagged', badgeColor: 'bg-rose-600 text-white', icon: 'AlertTriangle' };
    case 'pending_verification':
    default:
      return { label: 'Verification Pending', badgeColor: 'bg-slate-400 text-white', icon: 'Clock' };
  }
}

export const translations = {
  en: {
    appTitle: "Skill Sync",
    tagline: "Longitudinal Skilling Outcomes & Impact Tracker",
    govOrg: "Government of Maharashtra • Department of Skills, Employment, Entrepreneurship & Innovation",
    sihBadge: "SIH 2026 Problem Statement: SIH26135",
    role_state: "State Policy Dashboard",
    role_tp: "Training Provider Portal",
    role_employer: "Employer & Triangulation Hub",
    role_trainee: "Trainee Cockpit & PWA",
    role_simulators: "Multi-Channel Simulators",
    role_ai: "AI Predictive Studio",
    totalTrained: "Total Trained (Longitudinal)",
    retentionRate6M: "6-Month Verified Retention",
    retentionRate12M: "12-Month Retention",
    retentionRate24M: "24-Month Retention",
    avgWageGrowth: "Avg. Wage Multiplier",
    triangulationTrust: "Triangulation Trust Index",
    selfEmployment: "Self-Employment & Gig Rate",
    privacyCompliant: "DPDP Act 2023 Compliant",
    filterDistrict: "All Maharashtra Districts",
    filterSector: "All Industry Sectors",
    filterCohort: "All Cohorts",
    searchTrainee: "Search by Trainee Name, Token ID or Aadhaar...",
    exportReport: "Export Government Audit Report (PDF/CSV)",
  },
  mr: {
    appTitle: "स्किल सिंक (Skill Sync)",
    tagline: "कौशल्य विकास दीर्घकालीन रोजगार व परिणाम ट्रॅकर",
    govOrg: "महाराष्ट्र शासन • कौशल्य, रोजगार, उद्योजकता व नाविन्यता विभाग",
    sihBadge: "स्मार्ट इंडिया हॅकाथॉन २०२६ • PS SIH26135",
    role_state: "राज्यस्तरीय धोरण डॅशबोर्ड",
    role_tp: "प्रशिक्षण संस्था (TP/ITI) पोर्टल",
    role_employer: "नियोक्ता पडताळणी केंद्र",
    role_trainee: "प्रशिक्षणार्थी करिअर पोर्टल",
    role_simulators: "मल्टी-चॅनल सिम्युलेटर",
    role_ai: "AI प्रेडिक्टिव्ह स्टुडिओ",
    totalTrained: "एकूण प्रशिक्षित उमेदवार",
    retentionRate6M: "६ महिने रोजगार टिकवणूक",
    retentionRate12M: "१२ महिने रोजगार टिकवणूक",
    retentionRate24M: "२४ महिने रोजगार टिकवणूक",
    avgWageGrowth: "सरासरी वेतन वाढ गुणक",
    triangulationTrust: "त्रिकोणी पडताळणी विश्वास निर्देशांक",
    selfEmployment: "स्वयंरोजगार व सूक्ष्म उद्योग दर",
    privacyCompliant: "DPDP कायदा २०२३ सुसंगत",
    filterDistrict: "महाराष्ट्रातील सर्व जिल्हे",
    filterSector: "सर्व उद्योग क्षेत्रे",
    filterCohort: "सर्व तुकड्या (Cohorts)",
    searchTrainee: "उमेदवाराचे नाव किंवा टोकन आयडी शोधा...",
    exportReport: "शासकीय ऑडिट अहवाल डाउनलोड करा",
  },
  hi: {
    appTitle: "स्किल सिंक (Skill Sync)",
    tagline: "दीर्घकालिक कौशल्य रोजगार व प्रभाव ट्रैकर",
    govOrg: "महाराष्ट्र सरकार • कौशल, रोजगार, उद्यमिता एवं नवाचार विभाग",
    sihBadge: "स्मार्ट इंडिया हैकाथॉन 2026 • PS SIH26135",
    role_state: "राज्य नीति डैशबोर्ड",
    role_tp: "प्रशिक्षण प्रदाता (TP/ITI) पोर्टल",
    role_employer: "नियोक्ता सत्यापन केंद्र",
    role_trainee: "प्रशिक्षार्थी कॅरियर पोर्टल",
    role_simulators: "मल्टी-चैनल सिमुलेटर",
    role_ai: "AI प्रिडिक्टिव स्टूडियो",
    totalTrained: "कुल प्रशिक्षित उम्मीदवार",
    retentionRate6M: "6-माह रोजगार टिकने की दर",
    retentionRate12M: "12-माह रोजगार टिकने की दर",
    retentionRate24M: "24-माह रोजगार टिकने की दर",
    avgWageGrowth: "औसत वेतन वृद्धि गुणक",
    triangulationTrust: "त्रिकोणीय सत्यापन विश्वास सूचकांक",
    selfEmployment: "स्वरोजगार एवं सूक्ष्म उद्योग दर",
    privacyCompliant: "DPDP अधिनियम 2023 अनुरूप",
    filterDistrict: "महाराष्ट्र के सभी जिले",
    filterSector: "सभी उद्योग क्षेत्र",
    filterCohort: "सभी बैच (Cohorts)",
    searchTrainee: "प्रशिक्षार्थी का नाम या टोकन खोजें...",
    exportReport: "सरकारी ऑडिट रिपोर्ट डाउनलोड करें",
  }
};
