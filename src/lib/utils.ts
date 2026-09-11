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
      return { 
        label: 'Formal Sector (EPFO & ESIC Active)', 
        color: 'text-emerald-800 dark:text-emerald-300', 
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 font-semibold' 
      };
    case 'employed_informal':
      return { 
        label: 'Contractual / Informal Payroll', 
        color: 'text-blue-800 dark:text-blue-300', 
        bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 font-semibold' 
      };
    case 'self_employed':
      return { 
        label: 'Udyam Registered Enterprise / Micro-Business', 
        color: 'text-purple-800 dark:text-purple-300', 
        bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 font-semibold' 
      };
    case 'apprentice':
      return { 
        label: 'NAPS / NATS Apprenticeship Contract', 
        color: 'text-indigo-800 dark:text-indigo-300', 
        bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 font-semibold' 
      };
    case 'higher_education':
      return { 
        label: 'Higher Education / Polytechnic', 
        color: 'text-cyan-800 dark:text-cyan-300', 
        bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700 font-semibold' 
      };
    case 'unemployed_seeking':
      return { 
        label: 'Job Seeking / DSDC Skill Match In-Progress', 
        color: 'text-amber-800 dark:text-amber-300', 
        bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 font-semibold' 
      };
    case 'dropped_out':
      return { 
        label: 'Inactive / Early Attrition', 
        color: 'text-rose-800 dark:text-rose-300', 
        bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 font-semibold' 
      };
    default:
      return { label: status, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-300' };
  }
}

export function getVerificationBadgeInfo(status: VerificationStatus): { label: string; badgeColor: string; icon: string } {
  switch (status) {
    case 'verified_triangulated':
      return { label: 'Triangulated (100% Trust Index)', badgeColor: 'bg-emerald-600 text-white font-bold', icon: 'ShieldCheck' };
    case 'epfo_verified':
      return { label: 'EPFO/UAN Confirmed', badgeColor: 'bg-blue-700 text-white font-bold', icon: 'Building2' };
    case 'employer_verified':
      return { label: 'Employer HRMS Verified', badgeColor: 'bg-teal-700 text-white font-bold', icon: 'CheckCircle2' };
    case 'self_reported':
      return { label: 'Trainee Self-Reported', badgeColor: 'bg-amber-600 text-white font-bold', icon: 'UserCheck' };
    case 'disputed':
      return { label: 'Discrepancy Reported', badgeColor: 'bg-rose-700 text-white font-bold', icon: 'AlertTriangle' };
    case 'pending_verification':
    default:
      return { label: 'Pending Triangulation', badgeColor: 'bg-slate-500 text-white font-semibold', icon: 'Clock' };
  }
}

export const translations = {
  en: {
    appTitle: "Skill Sync",
    tagline: "Longitudinal Skilling Outcomes & Impact Measurement System",
    govOrg: "Government of Maharashtra • Department of Skills, Employment, Entrepreneurship & Innovation",
    msisDept: "Maharashtra State Innovation Society (MSIS)",
    sihBadge: "Smart India Hackathon 2026 • PS SIH26135",
    role_state: "State Policy Cockpit",
    role_tp: "Training Provider Portal",
    role_employer: "Employer & Triangulation Hub",
    role_trainee: "Trainee Cockpit & PWA",
    role_simulators: "Multi-Channel Simulators",
    role_ai: "Predictive AI Studio",
    totalTrained: "Total Trained (Longitudinal Cohort)",
    retentionRate6M: "6-Month Verified Retention",
    retentionRate12M: "12-Month Retention",
    retentionRate24M: "24-Month Retention",
    avgWageGrowth: "Avg. Wage Multiplier",
    triangulationTrust: "Triangulation Trust Index",
    selfEmployment: "Self-Employment & Micro-Enterprise",
    privacyCompliant: "DPDP Act 2023 Compliant",
    filterDistrict: "All Maharashtra Districts (36)",
    filterSector: "All Priority Industry Sectors",
    filterCohort: "All Longitudinal Cohorts",
    searchTrainee: "Search by Trainee Name, Virtual ID, or Aadhaar Mask...",
    exportReport: "Download DSDC / State Audit Dossier (CSV)",
    activeView: "Active Administrative View",
    stateView: "State / MSIS Executive Policy Dashboard",
    aiStudioView: "Predictive Attrition & Curriculum AI Studio",
    tpView: "Training Provider (TP/ITI) Intervention Hub",
    employerView: "Employer & Industry Verification Portal",
    traineeView: "Trainee Career Cockpit & DPDP Consent Vault",
    simulatorView: "Multi-Channel Conversational Re-Engagement Simulators",
    switchTrainee: "Switch Trainee Persona:",
    viewAI: "View AI Attrition & Skill Gaps",
    backToState: "Back to State KPI Overview",
    drilldown: "View District Analysis",
    viewCohorts: "Cohort Trajectory",
    inspect: "View Dossier",
    confirm: "Verify Employment",
    dispute: "Report Discrepancy",
    saveMilestone: "Record Milestone",
    cancel: "Cancel",
    search: "Search Records",
    all: "All Records",
    pending: "Pending Verification",
    verified: "Triangulated & Verified",
    disputed: "Discrepancy Flagged",
    exportAudit: "Export Maharashtra State Skilling Audit Dossier",
    downloadReport: "Download Official CSV Dataset",
    reportMilestone: "Report Salary Progression / Promotion",
    simulateBot: "Simulate WhatsApp Conversational Follow-Up",
    manageConsent: "Manage DPDP Act 2023 Consent",
    milestoneMonth: "Milestone Milestone",
    company: "Company / Enterprise Name",
    designation: "Official Designation",
    salary: "Verified Monthly Salary (₹ INR)",
    filter: "Filter Records",
    searchDistrict: "Search district by name or MIDC region...",
    allRegions: "All Administrative Divisions (6)",
    allTiers: "All Economic Tiers",
    districtPerformance: "Maharashtra 36-District Longitudinal Performance & Retention Ledger",
    tpScorecard: "Training Provider (TP & ITI) Longitudinal ROI Scorecard",
    longitudinalRetention: "Statewide Longitudinal Employment Retention (Month 3 to 36)",
    wageProgression: "Verified Wage Progression by Industry Sector (₹/Month)",
    aiEarlyWarning: "AI Early Warning: High Attrition Risk Trainees",
    traineeRoster: "Trainee Longitudinal Master Roster & Signal Triangulation",
    verificationQueue: "Pending Employer Verification & Reconciliation Queue",
    skillGapFeedback: "Direct Industry-to-Government Skill Deficiency Feedback",
    submitFeedback: "Submit Curriculum Feedback to MSIS",
    predictAttrition: "Predictive Trainee Attrition Risk Simulator",
    skillGaps: "NLP-Extracted Shopfloor Skill Gaps & State Syllabus Reforms",
    traineeTimeline: "Longitudinal Career & Wage Milestones",
    traineeTimelineSub: "Verified trajectory from initial training stipend to current market salary.",
    consentVault: "DPDP Act 2023 Consent Vault & Personalized Upskilling",
    consentVaultSub: "Data minimization under the DPDP Act 2023 — every record is pseudonymized.",
    manage: "Manage",
    wageGrowth: "Wage Growth",
    followUp: "Follow-Up",
    verifiedRecord: "Triangulated Verified Record",
    trustScore: "Triangulation Trust Score",
    employmentStatus: "Verified Employment Status",
    consentManageFor: "Manage data sharing permissions for",
    consentPlacementTitle: "Longitudinal Placement Follow-Up",
    consentPlacementSub: "Automated 6M/12M check-ins via WhatsApp & IVR",
    consentWageTitle: "Anonymized Wage Research",
    consentWageSub: "Aggregated wage multiplier benchmarks for MSIS policy",
    consentMatchingTitle: "Direct Employer Matching",
    consentMatchingSub: "Allow top Maharashtra recruiters to view your skill badge",
    consentTriangulationTitle: "EPFO & DigiLocker Triangulation",
    consentTriangulationSub: "Cryptographic verification without manual salary slips",
    consentToken: "Consent Token",
    consentLedgerNote: "Tamper-proof ledger entry. Changes are cryptographically logged per DPDP Act 2023 Section 8.",
    consentSave: "Save Consent Preferences",
    consentSaving: "Tokenizing Ledger Entry...",
    consentSaved: "Consent Updated!",
  },
  mr: {
    appTitle: "स्किल सिंक (Skill Sync)",
    tagline: "कौशल्य विकास दीर्घकालीन रोजगार व परिणाम ट्रॅकर",
    govOrg: "महाराष्ट्र शासन • कौशल्य, रोजगार, उद्योजकता व नाविन्यता विभाग",
    msisDept: "महाराष्ट्र राज्य नाविन्यता सोसायटी (MSIS)",
    sihBadge: "स्मार्ट इंडिया हॅकाथॉन २०२६ • PS SIH26135",
    role_state: "राज्यस्तरीय धोरण डॅशबोर्ड",
    role_tp: "प्रशिक्षण संस्था (TP/ITI) पोर्टल",
    role_employer: "नियोक्ता व उद्योग पडताळणी केंद्र",
    role_trainee: "प्रशिक्षणार्थी करिअर पोर्टल",
    role_simulators: "मल्टी-चॅनल सिम्युलेटर",
    role_ai: "AI प्रेडिक्टिव्ह स्टुडिओ",
    totalTrained: "एकूण प्रशिक्षित उमेदवार (दीर्घकालीन)",
    retentionRate6M: "६ महिने प्रमाणित रोजगार टिकवणूक",
    retentionRate12M: "१२ महिने रोजगार टिकवणूक",
    retentionRate24M: "२४ महिने रोजगार टिकवणूक",
    avgWageGrowth: "सरासरी वेतन वाढ गुणक",
    triangulationTrust: "त्रिकोणी पडताळणी विश्वास निर्देशांक",
    selfEmployment: "उद्यम नोंदणीकृत स्वयंरोजगार दर",
    privacyCompliant: "DPDP कायदा २०२३ सुसंगत",
    filterDistrict: "महाराष्ट्रातील सर्व ३६ जिल्हे",
    filterSector: "सर्व प्रमुख उद्योग क्षेत्रे",
    filterCohort: "सर्व तुकड्या (Cohorts)",
    searchTrainee: "उमेदवाराचे नाव, व्हर्च्युअल आयडी किंवा आधार मास्क शोधा...",
    exportReport: "शासकीय ऑडिट अहवाल डाउनलोड करा (CSV)",
    activeView: "सक्रिय प्रशासकीय दृश्य",
    stateView: "राज्य / MSIS धोरण डॅशबोर्ड",
    aiStudioView: "AI प्रेडिक्टिव्ह व अभ्यासक्रम स्टुडिओ",
    tpView: "प्रशिक्षण संस्था (TP/ITI) हस्तक्षेप केंद्र",
    employerView: "नियोक्ता व उद्योग पडताळणी पोर्टल",
    traineeView: "प्रशिक्षणार्थी करिअर कॉकपिट व DPDP वॉल्ट",
    simulatorView: "मल्टी-चॅनल पुनर्संपर्क सिम्युलेटर",
    switchTrainee: "प्रशिक्षणार्थी बदला:",
    viewAI: "AI च्युर्न आणि कौशल्य अंतर बघा",
    backToState: "राज्य KPI वर परत",
    drilldown: "जिल्हा तपशील",
    viewCohorts: "तुकड्या पहा",
    inspect: "डॉसियर तपासा",
    confirm: "रोजगार पुष्टी करा",
    dispute: "वाद नोंदवा",
    saveMilestone: "माइलस्टोन जतन करा",
    cancel: "रद्द करा",
    search: "नोंदी शोधा",
    all: "सर्व नोंदी",
    pending: "पडताळणी प्रलंबित",
    verified: "त्रिकोणी सत्यापित",
    disputed: "वादग्रस्त",
    exportAudit: "महाराष्ट्र राज्य कौशल्य ऑडिट अहवाल डाउनलोड करा",
    downloadReport: "अधिकृत CSV डेटा डाउनलोड करा",
    reportMilestone: "वेतन वाढ / पदोन्नती नोंदवा",
    simulateBot: "WhatsApp पुनर्संपर्क चॅट सिम्युलेट करा",
    manageConsent: "DPDP संमती व्यवस्थापित करा",
    milestoneMonth: "माइलस्टोन महिना",
    company: "कंपनी / उद्योगाचे नाव",
    designation: "पदनाम / भूमिका",
    salary: "नवीन मासिक पगार (₹ INR)",
    filter: "फिल्टर",
    searchDistrict: "जिल्हा किंवा MIDC प्रदेश शोधा...",
    allRegions: "सर्व महसूल विभाग (६)",
    allTiers: "सर्व टिअर",
    districtPerformance: "महाराष्ट्र जिल्हास्तरीय दीर्घकालीन कामगिरी तक्ता",
    tpScorecard: "प्रशिक्षण संस्था (TP & ITI) दीर्घकालीन ROI स्कोअरकार्ड",
    longitudinalRetention: "राज्यस्तरीय दीर्घकालीन रोजगार टिकवणूक (महिना ३ ते ३६)",
    wageProgression: "क्षेत्रानुसार वेतन वृद्धी (₹/महिना)",
    aiEarlyWarning: "AI पूर्वसूचना: उच्च च्युर्न धोका उमेदवार",
    traineeRoster: "प्रशिक्षणार्थी दीर्घकालीन यादी व त्रिकोणी पडताळणी",
    verificationQueue: "प्रशिक्षणार्थी रोजगार पडताळणी रांग",
    skillGapFeedback: "उद्योग-शासन कौशल्य अंतर अभिप्राय",
    submitFeedback: "MSIS कडे अभ्यासक्रम अभिप्राय सादर करा",
    predictAttrition: "उमेदवार च्युर्न धोका सिम्युलेटर",
    skillGaps: "NLP-विश्लेषित उद्योग कौशल्य अंतर व अभ्यासक्रम अद्ययावत",
    traineeTimeline: "दीर्घकालीन करिअर आणि वेतन माइलस्टोन",
    traineeTimelineSub: "आरंभिक प्रशिक्षण मानधनापासून सध्याच्या बाजारभाव पगारापर्यंत प्रमाणित वाटचाल.",
    consentVault: "DPDP कायदा २०२३ संमती वॉल्ट व वैयक्तिकृत कौशल्य विकास",
    consentVaultSub: "DPDP कायदा २०२३ अंतर्गत डेटा मिनिमायझेशन — प्रत्येक रेकॉर्ड स्युदोनिमाइज्ड.",
    manage: "व्यवस्थापित करा",
    wageGrowth: "वेतन वाढ",
    followUp: "पाठपुरावा",
    verifiedRecord: "त्रिकोणी सत्यापित रेकॉर्ड",
    trustScore: "त्रिकोणी पडताळणी विश्वास स्कोअर",
    employmentStatus: "प्रमाणित रोजगार स्थिती",
    consentManageFor: "खालील डेटा सामायिकरण परवानगी व्यवस्थापित करा",
    consentPlacementTitle: "दीर्घकालीन रोजगार पाठपुरावा",
    consentPlacementSub: "WhatsApp व IVR द्वारे आपोआप 6/12 महिने चेक-इन",
    consentWageTitle: "अनामित वेतन संशोधन",
    consentWageSub: "MSIS धोरणासाठी एकत्रित वेतन गुणक निकष",
    consentMatchingTitle: "थेट नियोक्ता जुळणी",
    consentMatchingSub: "महाराष्ट्रातील प्रमुख कंपन्यांना तुमचा स्किल बॅज पाहू द्या",
    consentTriangulationTitle: "EPFO व DigiLocker त्रिकोणी पडताळणी",
    consentTriangulationSub: "सॅलरी स्लिपशिवाय क्रिप्टोग्राफिक पडताळणी",
    consentToken: "संमती टोकन",
    consentLedgerNote: "छेडछाड-प्रतिरोधक लेजर नोंद. प्रत्येक बदल DPDP कायदा २०२३ कलम ८ नुसार क्रिप्टोग्राफिक नोंदवला जातो.",
    consentSave: "संमती सेटिंग्स जतन करा",
    consentSaving: "लेजर नोंद तयार होत आहे...",
    consentSaved: "संमती अद्ययावत!",
  },
  hi: {
    appTitle: "स्किल सिंक (Skill Sync)",
    tagline: "दीर्घकालिक कौशल्य रोजगार व प्रभाव मापन प्रणाली",
    govOrg: "महाराष्ट्र सरकार • कौशल, रोजगार, उद्यमिता एवं नवाचार विभाग",
    msisDept: "महाराष्ट्र राज्य नवाचार सोसायटी (MSIS)",
    sihBadge: "स्मार्ट इंडिया हैकाथॉन 2026 • PS SIH26135",
    role_state: "राज्य नीति डैशबोर्ड",
    role_tp: "प्रशिक्षण प्रदाता (TP/ITI) पोर्टल",
    role_employer: "नियोक्ता सत्यापन केंद्र",
    role_trainee: "प्रशिक्षार्थी कॅरियर पोर्टल",
    role_simulators: "मल्टी-चैनल सिमुलेटर",
    role_ai: "AI प्रिडिक्टिव स्टूडियो",
    totalTrained: "कुल प्रशिक्षित उम्मीदवार (दीर्घकालिक)",
    retentionRate6M: "6-माह प्रमाणित रोजगार टिकने की दर",
    retentionRate12M: "12-माह रोजगार टिकने की दर",
    retentionRate24M: "24-माह रोजगार टिकने की दर",
    avgWageGrowth: "औसत वेतन वृद्धि गुणक",
    triangulationTrust: "त्रिकोणीय सत्यापन विश्वास सूचकांक",
    selfEmployment: "उद्यम पंजीकृत स्वरोजगार दर",
    privacyCompliant: "DPDP अधिनियम 2023 अनुरूप",
    filterDistrict: "महाराष्ट्र के सभी 36 जिले",
    filterSector: "सभी प्रमुख उद्योग क्षेत्र",
    filterCohort: "सभी बैच (Cohorts)",
    searchTrainee: "प्रशिक्षार्थी का नाम, वर्चुअल आईडी या आधार खोजें...",
    exportReport: "सरकारी ऑडिट रिपोर्ट डाउनलोड करें (CSV)",
    activeView: "सक्रिय प्रशासनिक दृश्य",
    stateView: "राज्य / MSIS नीति डैशबोर्ड",
    aiStudioView: "AI प्रिडिक्टिव व पाठ्यक्रम स्टूडियो",
    tpView: "प्रशिक्षण प्रदाता (TP/ITI) हस्तक्षेप केंद्र",
    employerView: "नियोक्ता और उद्योग सत्यापन पोर्टल",
    traineeView: "प्रशिक्षार्थी करियर कॉकपिट और DPDP वॉल्ट",
    simulatorView: "मल्टी-चैनल पुनः संपर्क सिमुलेटर",
    switchTrainee: "प्रशिक्षार्थी बदलें:",
    viewAI: "AI चर्न और कौशल अंतर देखें",
    backToState: "राज्य KPI अवलोकन पर वापस",
    drilldown: "जिला विवरण",
    viewCohorts: "बैच देखें",
    inspect: "डॉसियर निरीक्षण",
    confirm: "रोजगार पुष्टि करें",
    dispute: "विवाद दर्ज करें",
    saveMilestone: "माइलस्टोन सहेजें",
    cancel: "रद्द करें",
    search: "खोजें",
    all: "सभी रिकॉर्ड",
    pending: "सत्यापन लंबित",
    verified: "त्रिकोणीय सत्यापित",
    disputed: "विवादित",
    exportAudit: "महाराष्ट्र राज्य कौशल ऑडिट रिपोर्ट डाउनलोड करें",
    downloadReport: "आधिकारिक CSV डेटा डाउनलोड करें",
    reportMilestone: "वेतन वृद्धि / पदोन्नति दर्ज करें",
    simulateBot: "WhatsApp पुनः संपर्क चैट सिमुलेट करें",
    manageConsent: "DPDP सहमति प्रबंधित करें",
    milestoneMonth: "माइलस्टोन माह",
    company: "कंपनी / उद्यम का नाम",
    designation: "पदनाम / भूमिका",
    salary: "नया मासिक वेतन (₹ INR)",
    filter: "फ़िल्टर",
    searchDistrict: "जिला या MIDC क्षेत्र खोजें...",
    allRegions: "सभी संभाग (6)",
    allTiers: "सभी श्रेणियाँ",
    districtPerformance: "महाराष्ट्र जिला-वार दीर्घकालिक प्रदर्शन तालिका",
    tpScorecard: "प्रशिक्षण प्रदाता (TP & ITI) दीर्घकालिक ROI स्कोरकार्ड",
    longitudinalRetention: "राज्य-व्यापी दीर्घकालिक रोजगार प्रतिधारण (माह 3 से 36)",
    wageProgression: "क्षेत्र-अनुसार वेतन वृद्धि (₹/माह)",
    aiEarlyWarning: "AI प्रारंभिक चेतावनी: उच्च चर्न जोखिम उम्मीदवार",
    traineeRoster: "प्रशिक्षार्थी दीर्घकालिक सूची और त्रिकोणीय सत्यापन",
    verificationQueue: "प्रशिक्षार्थी रोजगार सत्यापन कतार",
    skillGapFeedback: "उद्योग-सरकार कौशल अंतर प्रतिक्रिया",
    submitFeedback: "MSIS को पाठ्यक्रम प्रतिक्रिया सबमिट करें",
    predictAttrition: "उम्मीदवार चर्न जोखिम सिमुलेटर",
    skillGaps: "NLP-विश्लेषित उद्योग कौशल अंतर और पाठ्यक्रम अपडेट",
    traineeTimeline: "दीर्घकालिक करियर और वेतन माइलस्टोन",
    traineeTimelineSub: "प्रारंभिक प्रशिक्षण मानधन से वर्तमान बाजार वेतन तक सत्यापित यात्रा.",
    consentVault: "DPDP अधिनियम 2023 सहमति वॉल्ट और व्यक्तिगत कौशल विकास",
    consentVaultSub: "DPDP अधिनियम 2023 के तहत डेटा मिनिमाइज़ेशन — हर रिकॉर्ड छद्मनामित है.",
    manage: "प्रबंधित करें",
    wageGrowth: "वेतन वृद्धि",
    followUp: "अनुवर्तन",
    verifiedRecord: "त्रिकोणीय सत्यापित रिकॉर्ड",
    trustScore: "त्रिकोणीय सत्यापन विश्वास स्कोर",
    employmentStatus: "सत्यापित रोजगार स्थिति",
    consentManageFor: "निम्न डेटा-साझाकरण अनुमतियाँ प्रबंधित करें",
    consentPlacementTitle: "दीर्घकालिक रोजगार अनुवर्तन",
    consentPlacementSub: "WhatsApp व IVR द्वारे स्वचालित 6/12 माह चेक-इन",
    consentWageTitle: "अनामित वेतन अनुसंधान",
    consentWageSub: "MSIS नीति हेतु समग्र वेतन गुणक बेंचमार्क",
    consentMatchingTitle: "सीधा नियोक्ता मिलान",
    consentMatchingSub: "महाराष्ट्र के शीर्ष नियोक्ताओं को आपका स्किल बैज देखने दें",
    consentTriangulationTitle: "EPFO व DigiLocker त्रिकोणीय सत्यापन",
    consentTriangulationSub: "मैनुअल वेतन-पर्ची के बिना क्रिप्टोग्राफिक सत्यापन",
    consentToken: "सहमति टोकन",
    consentLedgerNote: "छेड़छाड़-रोधी लेज़र प्रविष्टि। हर बदलाव DPDP अधिनियम 2023 धारा 8 के अनुसार क्रिप्टोग्राफिक रूप से लॉग होता है।",
    consentSave: "सहमति प्राथमिकताएँ सहेजें",
    consentSaving: "लेज़र प्रविष्टि टोकनाइज़ हो रही है...",
    consentSaved: "सहमति अपडेट की गई!",
  }
};
