'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  MAHARASHTRA_DISTRICTS, 
  TRAINING_PROVIDERS, 
  SECTOR_OUTCOMES, 
  EMPLOYER_VERIFICATION_QUEUE 
} from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { StateDashboard } from '@/components/StateDashboard';
import { Footer } from '@/components/Footer';

import { translations } from '@/lib/utils';
import { useGlobalState } from '@/lib/globalState';
import { Role } from '@/types';
import { Sparkles } from 'lucide-react';

// Role views are heavy (Recharts, NLP data, stress bench) — load them only when the role is entered
const TrainingProviderPortal = dynamic(
  () => import('@/components/TrainingProviderPortal').then(m => m.TrainingProviderPortal),
  { ssr: false }
);
const EmployerPortal = dynamic(
  () => import('@/components/EmployerPortal').then(m => m.EmployerPortal),
  { ssr: false }
);
const TraineePortal = dynamic(
  () => import('@/components/TraineePortal').then(m => m.TraineePortal),
  { ssr: false }
);
const SimulatorsContainer = dynamic(
  () => import('@/components/Simulators').then(m => m.SimulatorsContainer),
  { ssr: false }
);
const PredictiveAIStudio = dynamic(
  () => import('@/components/PredictiveAIStudio').then(m => m.PredictiveAIStudio),
  { ssr: false }
);

// On-demand dialogs
const TraineeDetailModal = dynamic(
  () => import('@/components/TraineeDetailModal').then(m => m.TraineeDetailModal),
  { ssr: false }
);
const ExportReportModal = dynamic(
  () => import('@/components/ExportReportModal').then(m => m.ExportReportModal),
  { ssr: false }
);
const ConsentModal = dynamic(
  () => import('@/components/ConsentModal').then(m => m.ConsentModal),
  { ssr: false }
);
const LiveMobileDemoModal = dynamic(
  () => import('@/components/LiveMobileDemoModal').then(m => m.LiveMobileDemoModal),
  { ssr: false }
);

export default function Home() {
  const {
    currentRole,
    setCurrentRole,
    currentLanguage,
    setCurrentLanguage,
    trainees,
    activeTraineeIndex,
    setActiveTraineeIndex,
    selectedTrainee,
    setSelectedTrainee,
    isExportModalOpen,
    setIsExportModalOpen,
    isLiveMobileQRModalOpen,
    setIsLiveMobileQRModalOpen,
    isConsentModalOpen,
    setIsConsentModalOpen,
    showAIStudioView,
    setShowAIStudioView,
    recordMilestone,
    ingestBotOutcome,
    updateConsent,
  } = useGlobalState();

  const t = translations[currentLanguage] || translations.en;

  // Handle QR-scan deep links (?role=simulators&demo=mobile) so a scanned
  // phone lands directly on the intended role view.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const validRoles: Array<Role> = ['state_admin', 'training_provider', 'employer', 'trainee', 'simulators', 'ai_studio'];
    if (role && (validRoles as string[]).includes(role)) {
      setCurrentRole(role as Role);
      if (params.get('demo') === 'mobile') setIsLiveMobileQRModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [setCurrentRole, setIsLiveMobileQRModalOpen]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenLiveMobileQR={() => setIsLiveMobileQRModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Quick Role & Feature Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs print:hidden">
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
            onOpenExportReport={() => setIsExportModalOpen(true)}
          />
        )}

        {currentRole === 'state_admin' && showAIStudioView && (
          <PredictiveAIStudio currentLanguage={currentLanguage} />
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
            onUpdateMilestone={recordMilestone}
            onOpenConsentModal={() => setIsConsentModalOpen(true)}
            onOpenSimulators={() => setCurrentRole('simulators')}
          />
        )}

        {currentRole === 'simulators' && (
          <SimulatorsContainer onOutcomeSubmitted={ingestBotOutcome} />
        )}

        {currentRole === 'ai_studio' && (
          <PredictiveAIStudio currentLanguage={currentLanguage} />
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
          onSave={updateConsent}
          currentLanguage={currentLanguage}
        />
      )}

      {/* Live Mobile QR Interactive Demo Modal */}
      {isLiveMobileQRModalOpen && (
        <LiveMobileDemoModal
          isOpen={isLiveMobileQRModalOpen}
          onClose={() => setIsLiveMobileQRModalOpen(false)}
          onSimulateLiveUpdate={(salary, status) => {
            ingestBotOutcome({
              salary,
              status,
              channel: 'whatsapp_qr_demo'
            });
          }}
        />
      )}

      {/* Official Government of Maharashtra Footer */}
      <Footer currentLanguage={currentLanguage} />
    </div>
  );
}
