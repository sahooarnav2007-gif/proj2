'use client';

import React, { useState } from 'react';
import { Role, Language, Trainee, EmployerVerificationItem } from '@/types';
import { 
  MAHARASHTRA_DISTRICTS, 
  TRAINING_PROVIDERS, 
  SECTOR_OUTCOMES, 
  MOCK_TRAINEES, 
  EMPLOYER_VERIFICATION_QUEUE 
} from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { StateDashboard } from '@/components/StateDashboard';
import { TrainingProviderPortal } from '@/components/TrainingProviderPortal';
import { EmployerPortal } from '@/components/EmployerPortal';
import { TraineePortal } from '@/components/TraineePortal';
import { SimulatorsContainer } from '@/components/Simulators';
import { PredictiveAIStudio } from '@/components/PredictiveAIStudio';
import { TraineeDetailModal } from '@/components/TraineeDetailModal';
import { ExportReportModal } from '@/components/ExportReportModal';
import { ConsentModal } from '@/components/ConsentModal';
import { Sparkles, Bot, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function Home() {
  // Global State
  const [currentRole, setCurrentRole] = useState<Role>('state_admin');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [trainees, setTrainees] = useState<Trainee[]>(MOCK_TRAINEES);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [showAIStudioView, setShowAIStudioView] = useState<boolean>(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);

  // Active trainee persona for trainee portal view
  const [activeTraineeIndex, setActiveTraineeIndex] = useState<number>(0);

  // Handle milestone reporting from Trainee portal or WhatsApp Bot
  const handleUpdateMilestone = (month: number, salary: number, designation: string, company: string) => {
    setTrainees(prev => prev.map((t, idx) => {
      if (idx === activeTraineeIndex) {
        const updatedTimeline = [
          ...t.longitudinalTimeline,
          {
            month: month as any,
            timestamp: '2026-03-01',
            status: 'employed_formal' as const,
            companyName: company,
            designation: designation,
            monthlySalary: salary,
            epfoUanMatched: true,
            verificationStatus: 'verified_triangulated' as const,
            trustScore: 100,
            channelUsed: 'pwa_portal' as const,
            attritionRiskScore: 10
          }
        ];

        return {
          ...t,
          currentSalary: salary,
          currentEmployer: company,
          currentDesignation: designation,
          skillCoins: t.skillCoins + 50,
          overallTrustScore: 100,
          longitudinalTimeline: updatedTimeline
        };
      }
      return t;
    }));
  };

  // Handle bot outcome update
  const handleBotOutcomeSubmitted = (data: { salary: number; status: string; channel: string }) => {
    setTrainees(prev => prev.map((t, idx) => {
      if (idx === 0) {
        return {
          ...t,
          currentSalary: data.salary,
          skillCoins: t.skillCoins + 50,
          overallTrustScore: 98
        };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          setShowAIStudioView(false);
        }}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Quick Role & Feature Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">{t.activeView}:</span>
            <span className="bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 font-bold px-2.5 py-1 rounded-lg">
              {currentRole === 'state_admin' && !showAIStudioView ? t.stateView :
               currentRole === 'state_admin' && showAIStudioView ? t.aiStudioView :
               currentRole === 'training_provider' ? t.tpView :
               currentRole === 'employer' ? t.employerView :
               currentRole === 'trainee' ? t.traineeView :
               t.simulatorView}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentRole === 'trainee' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{t.switchTrainee}</span>
                <select
                  value={activeTraineeIndex}
                  onChange={(e) => setActiveTraineeIndex(Number(e.target.value))}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold"
                >
                  {trainees.map((t, idx) => (
                    <option key={t.id} value={idx}>
                      {t.fullName} ({t.sector})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentRole === 'state_admin' && (
              <button
                onClick={() => setShowAIStudioView(!showAIStudioView)}
                className="flex items-center gap-1.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg font-bold hover:bg-purple-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showAIStudioView ? t.backToState : t.viewAI}</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switching */}
        {currentRole === 'state_admin' && !showAIStudioView && (
          <StateDashboard
            currentLanguage={currentLanguage}
            districts={MAHARASHTRA_DISTRICTS}
            trainingProviders={TRAINING_PROVIDERS}
            sectors={SECTOR_OUTCOMES}
            onSelectDistrict={(dist) => {
              setCurrentRole('training_provider');
            }}
            onSelectTP={(tpId) => {
              setCurrentRole('training_provider');
            }}
            onOpenAIStudio={() => setShowAIStudioView(true)}
          />
        )}

        {currentRole === 'state_admin' && showAIStudioView && (
          <PredictiveAIStudio />
        )}

        {currentRole === 'training_provider' && (
          <TrainingProviderPortal
            currentLanguage={currentLanguage}
            trainees={trainees}
            onSelectTrainee={(t) => setSelectedTrainee(t)}
            onOpenSimulators={() => setCurrentRole('simulators')}
          />
        )}

        {currentRole === 'employer' && (
          <EmployerPortal
            currentLanguage={currentLanguage}
            initialQueue={EMPLOYER_VERIFICATION_QUEUE}
          />
        )}

        {currentRole === 'trainee' && (
          <TraineePortal
            currentLanguage={currentLanguage}
            trainee={trainees[activeTraineeIndex] || trainees[0]}
            onUpdateMilestone={handleUpdateMilestone}
            onOpenConsentModal={() => setIsConsentModalOpen(true)}
            onOpenSimulators={() => setCurrentRole('simulators')}
          />
        )}

        {currentRole === 'simulators' && (
          <SimulatorsContainer onOutcomeSubmitted={handleBotOutcomeSubmitted} />
        )}
      </main>

      {/* Trainee Detail Dossier Modal */}
      {selectedTrainee && (
        <TraineeDetailModal
          trainee={selectedTrainee}
          onClose={() => setSelectedTrainee(null)}
        />
      )}

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <ExportReportModal
          trainees={trainees}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Consent Modal */}
      {isConsentModalOpen && (
        <ConsentModal
          trainee={trainees[activeTraineeIndex] || trainees[0]}
          onClose={() => setIsConsentModalOpen(false)}
          onSave={(consent) => {
            setTrainees(prev => prev.map((t, idx) => {
              if (idx === (activeTraineeIndex || 0)) {
                return { ...t, activeConsent: consent };
              }
              return t;
            }));
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Skill Sync</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (PS SIH26135)</span>
            <span>•</span>
            <span>Maharashtra State Innovation Society</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant</span>
            </span>
            <span>v2.6 Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
