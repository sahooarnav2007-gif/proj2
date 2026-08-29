# 🎓 Skill Sync — Longitudinal Skilling Outcomes & Impact Tracker

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026_PS_SIH26135-orange.svg)](https://sih.gov.in)
[![Government of Maharashtra](https://img.shields.io/badge/Sponsored_By-Govt_of_Maharashtra_MSIS-blue.svg)](https://msins.in)
[![DPDP Act 2023](https://img.shields.io/badge/Privacy-DPDP_Act_2023_Compliant-emerald.svg)](https://www.meity.gov.in)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js_14_React_Tailwind-black.svg)](https://nextjs.org)

**Skill Sync** is a longitudinal skilling-outcomes and impact-measurement system developed for **Smart India Hackathon 2026** (Problem Statement **SIH26135**), sponsored by the **Government of Maharashtra** (*Maharashtra State Innovation Society (MSIS), Department of Skills, Employment, Entrepreneurship and Innovation*).

---

## 📌 Problem Statement (PS SIH26135)
- **Title**: Difficulties in tracking employment outcomes, skill gaps, and the impact of skilling initiatives
- **Organisation**: Government of Maharashtra
- **Department**: Maharashtra State Innovation Society (MSIS), Department of Skills, Employment, Entrepreneurship and Innovation
- **Category**: Software | **Theme**: Smart Education

### The Challenge
Training portals today capture enrolment, attendance, assessment, and certification well — but reliable longitudinal information on what happens **3, 6, 12, 24, and 36 months after training** (job retention, wage progression, self-employment, and skill relevance) is lost due to phone number churn, employer reporting inertia, and fragmented identifiers.

---

## 🚀 Our Solution: The Triangulation Engine

Skill Sync eliminates contact loss and data fraud through **Multi-Channel Conversational Re-Engagement** combined with **3-Way Signal Triangulation**:

1. **Multi-Channel Conversational Follow-Up**:
   - **WhatsApp Conversational Bot**: Interactive rich surveys in Marathi, Hindi, and English with zero app-download friction.
   - **AI IVR Voice Agent Simulator**: Automated bilingual voice calls for rural candidates on basic 2G/3G feature phones in districts like Gadchiroli and Nandurbar.
   - **Trainee Progressive Web App (PWA)**: Gamified career tracker with **SkillCoins** incentives for reporting wage hikes.

2. **Triangulated Trust Verification**:
   - **Signal 1: Trainee Self-Report** (Voice / WhatsApp / PWA)
   - **Signal 2: Employer 1-Click Verification & Bulk HRMS API**
   - **Signal 3: EPFO / UAN Provident Fund & ESIC Triangulation** (Formal Sector)
   - **Signal 4: Udyam Registration & MUDRA Loan Linking** (Self-Employment / Micro-Enterprises)
   - **Signal 5: NAPS / NATS Apprenticeship Registry**

3. **Predictive AI & Skill-Gap NLP Core**:
   - **Early Attrition Risk Predictor**: Machine learning model forecasting job exit probability (0-100%) to trigger proactive counselor intervention before drop-out.
   - **NLP Skill-Gap Topic Clustering**: Ingests employer remarks and exit interviews to isolate shopfloor equipment & soft-skill deficiencies directly for MSIS curriculum reform.

4. **DPDP Act 2023 Compliant Consent Vault**:
   - Granular, purpose-specific, revocable consent logging with tokenized/pseudonymized identifiers.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             Training Portals (MSSDS / ITI / PMKVY)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Ingest Certification & Consent)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          DPDP Act 2023 Consent & Tokenization Vault          │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌──────────────────────┐ ┌───────────────┐ ┌──────────────────┐
│ WhatsApp Bot Engine  │ │ Marathi IVR   │ │ Trainee PWA &    │
│ (MR / HI / EN)       │ │ Voice Agent   │ │ SkillCoins Vault │
└───────────┬──────────┘ └───────┬───────┘ └────────┬─────────┘
            │                    │                  │
            └────────────────────┼──────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│          Multi-Signal Triangulation Engine (Trust Index)    │
│  - Employer 1-Click API  - EPFO/UAN Proxy  - Udyam Validator │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ Predictive Attrition AI Model │   │ NLP Skill-Gap Topic Clusters  │
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                └─────────────────┬─────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Role-Based Stakeholder Portals           │
│  🏛️ State Policy  🏫 Training Providers  🏢 Employers  📱 Trainee│
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 4 Role-Based Portals

| Role | Core Capabilities |
| :--- | :--- |
| **🏛️ State / MSIS Policy Dashboard** | Statewide KPIs (142k+ tracked), 36 Maharashtra district breakdown, TP ROI leaderboard, longitudinal retention curves (3M to 36M), wage growth multipliers, and AI policy recommendations. |
| **🏫 Training Provider (ITI/TP) Hub** | Cohort milestone tracker (Day 90, 180, 365, 730), 1-click batch re-engagement campaign dispatcher, high attrition risk intervention queue. |
| **🏢 Employer & Triangulation Hub** | 1-click employment verification queue, bulk HRMS payroll upload simulator, direct industry skill-gap feedback submission to state curriculum boards. |
| **📱 Trainee Career Cockpit (PWA)** | Longitudinal milestone timeline, DPDP consent management toggles, salary update reporting, SkillCoins gamification, and state-sponsored bridge courses. |

---

## 🛠️ Technology Stack

- **Frontend & App Router**: Next.js 14.2, React 18, TypeScript, Tailwind CSS
- **Data Visualization**: Recharts (Longitudinal Area charts, Multi-tier Bar charts)
- **Icons & UI**: Lucide React, Tailwind Merge, CLSX
- **Simulators**: Interactive WhatsApp Bot (MR/HI/EN), Marathi AI IVR Voice Simulator, EPFO/Udyam Cryptographic Signal Sandbox
- **Privacy & Security**: Digital Personal Data Protection (DPDP) Act 2023 Tokenization Framework

---

## ⚙️ Getting Started & Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Run Locally
```bash
# 1. Navigate to project folder
cd skill-sync

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Verification & Audit Export
Skill Sync features a built-in **Government Audit Export Engine** generating DPDP-compliant CSV and PDF datasets for state legislative reviews, comptroller audits, and scheme ROI evaluations.

---

## 🏆 Smart India Hackathon 2026 Submission
- **Problem Statement ID**: SIH26135
- **Department**: Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship & Innovation
- **Platform**: Skill Sync v2.6 Prototype
