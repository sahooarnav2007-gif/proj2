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

export function getStatusBadgeInfo(status: EmploymentStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'employed_formal':
      return { label: 'Formal Employment (EPFO)', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' };
    case 'employed_informal':
      return { label: 'Informal / Contract', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800' };
    case 'self_employed':
      return { label: 'Self-Employed (Udyam)', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800' };
    case 'apprentice':
      return { label: 'Apprenticeship (NAPS)', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800' };
    case 'higher_education':
      return { label: 'Higher Education', color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-300 dark:border-cyan-800' };
    case 'unemployed_seeking':
      return { label: 'Job Seeking / Gap', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' };
    case 'dropped_out':
      return { label: 'Dropped Out / Inactive', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800' };
    default:
      return { label: status, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-300' };
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
    activeView: "Active View",
    stateView: "State / MSIS Policy Dashboard",
    aiStudioView: "AI Predictive Studio",
    tpView: "Training Provider (TP/ITI) Intervention Hub",
    employerView: "Employer & Industry Verification Portal",
    traineeView: "Trainee Career Cockpit & DPDP Vault",
    simulatorView: "Multi-Channel Re-Engagement Simulators",
    switchTrainee: "Switch Trainee Persona:",
    viewAI: "View AI Attrition & Skill Gaps",
    backToState: "Back to State KPI Overview",
    drilldown: "Drilldown",
    viewCohorts: "View Cohorts",
    inspect: "Inspect",
    confirm: "Confirm",
    dispute: "Dispute",
    saveMilestone: "Save Milestone",
    cancel: "Cancel",
    search: "Search",
    all: "All",
    pending: "Pending",
    verified: "Verified",
    disputed: "Disputed",
    exportAudit: "Export Government Audit Report",
    downloadReport: "Download Audit Report",
    reportMilestone: "Report Salary Hike / Job Transition",
    simulateBot: "Simulate WhatsApp Re-Engagement Chat",
    manageConsent: "Manage DPDP Consent",
    milestoneMonth: "Milestone Month",
    company: "Company / Enterprise Name",
    designation: "Designation / Role",
    salary: "New Monthly Take-Home Salary (₹ INR)",
    filter: "Filter",
    searchDistrict: "Search district...",
    allRegions: "All Regions (6)",
    allTiers: "All Tiers",
    districtPerformance: "Maharashtra District-Wise Longitudinal Performance Table",
    tpScorecard: "Training Provider (TP & ITI) Longitudinal ROI Scorecard",
    longitudinalRetention: "Statewide Longitudinal Employment Retention (Month 3 to 36)",
    wageProgression: "Wage Progression by Sector (₹/Month)",
    aiEarlyWarning: "AI Early Warning: High Attrition Risk Candidates",
    traineeRoster: "Trainee Longitudinal Roster & Triangulation Status",
    verificationQueue: "Trainee Employment Verification Queue",
    skillGapFeedback: "Direct Industry-to-Government Skill Gap Feedback",
    submitFeedback: "Submit Curriculum Feedback",
    predictAttrition: "Candidate Attrition Risk Simulator",
    skillGaps: "NLP-Extracted Industry Skill Gaps & Curriculum Upgrades",
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
    activeView: "सक्रिय दृश्य",
    stateView: "राज्य / MSIS धोरण डॅशबोर्ड",
    aiStudioView: "AI प्रेडिक्टिव्ह स्टुडिओ",
    tpView: "प्रशिक्षण संस्था (TP/ITI) हस्तक्षेप केंद्र",
    employerView: "नियोक्ता व उद्योग पडताळणी पोर्टल",
    traineeView: "प्रशिक्षणार्थी करिअर कॉकपिट व DPDP वॉल्ट",
    simulatorView: "मल्टी-चॅनल पुनर्संपर्क सिम्युलेटर",
    switchTrainee: "प्रशिक्षणार्थी बदला:",
    viewAI: "AI च्युर्न आणि कौशल्य तरुण बघा",
    backToState: "राज्य KPI वर परत",
    drilldown: "ड्रिलडाउन",
    viewCohorts: "तुकड्या पहा",
    inspect: "तपासा",
    confirm: "पुष्टी करा",
    dispute: "वाद नोंदवा",
    saveMilestone: "माइलस्टोन जतन करा",
    cancel: "रद्द करा",
    search: "शोधा",
    all: "सर्व",
    pending: "प्रलंबित",
    verified: "सत्यापित",
    disputed: "वादग्रस्त",
    exportAudit: "शासकीय ऑडिट अहवाल डाउनलोड करा",
    downloadReport: "अहवाल डाउनलोड करा",
    reportMilestone: "पगार वाढ / नोकरी बदल नोंदवा",
    simulateBot: "WhatsApp पुनर्संपर्क चॅट सिम्युलेट करा",
    manageConsent: "DPDP संमती व्यवस्थापित करा",
    milestoneMonth: "माइलस्टोन महिना",
    company: "कंपनी / उद्योगाचे नाव",
    designation: "पदनाम / भूमिका",
    salary: "नवीन मासिक पगार (₹ INR)",
    filter: "फिल्टर",
    searchDistrict: "जिल्हा शोधा...",
    allRegions: "सर्व प्रदेश (६)",
    allTiers: "सर्व टिअर",
    districtPerformance: "महाराष्ट्र जिल्हा स्तरीय दीर्घकालीन कामगिरी तक्ता",
    tpScorecard: "प्रशिक्षण संस्था (TP & ITI) दीर्घकालीन ROI स्कोअरकार्ड",
    longitudinalRetention: "राज्यस्तरीय दीर्घकालीन रोजगार टिकवणूक (महिना ३ ते ३६)",
    wageProgression: "क्षेत्रनुसार वेतन वृद्धी (₹/महिना)",
    aiEarlyWarning: "AI पूर्वसूचना: उच्च च्युर्न धोका उमेदवार",
    traineeRoster: "प्रशिक्षणार्थी दीर्घकालीन यादी व त्रिकोणी पडताळणी",
    verificationQueue: "प्रशिक्षणार्थी रोजगार पडताळणी रांग",
    skillGapFeedback: "उद्योग-शासन कौशल्य तरुण अभिप्राय",
    submitFeedback: "अभ्यासक्रम अभिप्राय सादर करा",
    predictAttrition: "उमेदवार च्युर्न धोका सिम्युलेटर",
    skillGaps: "NLP-विषलेषित उद्योग कौशल्य तरुण व अभ्यासक्रम अद्ययावत",
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
    activeView: "सक्रिय दृश्य",
    stateView: "राज्य / MSIS नीति डैशबोर्ड",
    aiStudioView: "AI प्रिडिक्टिव स्टूडियो",
    tpView: "प्रशिक्षण प्रदाता (TP/ITI) हस्तक्षेप केंद्र",
    employerView: "नियोक्ता और उद्योग सत्यापन पोर्टल",
    traineeView: "प्रशिक्षार्थी करियर कॉकपिट और DPDP वॉल्ट",
    simulatorView: "मल्टी-चैनल पुनः संपर्क सिमुलेटर",
    switchTrainee: "प्रशिक्षार्थी बदलें:",
    viewAI: "AI चर्न और कौशल अंतर देखें",
    backToState: "राज्य KPI अवलोकन पर वापस",
    drilldown: "विवरण",
    viewCohorts: "बैच देखें",
    inspect: "निरीक्षण",
    confirm: "पुष्टि",
    dispute: "विवाद",
    saveMilestone: "माइलस्टोन सहेजें",
    cancel: "रद्द करें",
    search: "खोजें",
    all: "सभी",
    pending: "लंबित",
    verified: "सत्यापित",
    disputed: "विवादित",
    exportAudit: "सरकारी ऑडिट रिपोर्ट डाउनलोड करें",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    reportMilestone: "वेतन वृद्धि / नौकरी परिवर्तन दर्ज करें",
    simulateBot: "WhatsApp पुनः संपर्क चैट सिमुलेट करें",
    manageConsent: "DPDP सहमति प्रबंधित करें",
    milestoneMonth: "माइलस्टोन माह",
    company: "कंपनी / उद्यम का नाम",
    designation: "पदनाम / भूमिका",
    salary: "नया मासिक वेतन (₹ INR)",
    filter: "फ़िल्टर",
    searchDistrict: "जिला खोजें...",
    allRegions: "सभी क्षेत्र (6)",
    allTiers: "सभी श्रेणियाँ",
    districtPerformance: "महाराष्ट्र जिला-वार दीर्घकालिक प्रदर्शन तालिका",
    tpScorecard: "प्रशिक्षण प्रदाता (TP & ITI) दीर्घकालिक ROI स्कोरकार्ड",
    longitudinalRetention: "राज्य-व्यापी दीर्घकालिक रोजगार प्रतिधारण (माह 3 से 36)",
    wageProgression: "क्षेत्र-अनुसार वेतन वृद्धि (₹/माह)",
    aiEarlyWarning: "AI प्रारंभिक चेतावनी: उच्च चर्न जोखिम उम्मीदवार",
    traineeRoster: "प्रशिक्षार्थी दीर्घकालिक सूची और त्रिकोणीय सत्यापन",
    verificationQueue: "प्रशिक्षार्थी रोजगार सत्यापन कतार",
    skillGapFeedback: "उद्योग-सरकार कौशल अंतर प्रतिक्रिया",
    submitFeedback: "पाठ्यक्रम प्रतिक्रिया सबमिट करें",
    predictAttrition: "उम्मीदवार चर्न जोखिम सिमुलेटर",
    skillGaps: "NLP-विश्लेषित उद्योग कौशल अंतर और पाठ्यक्रम अपडेट",
  }
};
