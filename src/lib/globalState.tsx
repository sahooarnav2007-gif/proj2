'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Role, Language, Trainee, LongitudinalRecord } from '@/types';
import { MOCK_TRAINEES } from '@/data/mockData';
import { formatINR } from '@/lib/utils';
import { ingestTelemetry } from '@/lib/mockApi';
import { useLiveEvents } from '@/lib/liveEvents';

const STORAGE_KEY = 'skill-sync-state-v1';

function loadPersistedTrainees(): Trainee[] {
  if (typeof window === 'undefined') return MOCK_TRAINEES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return MOCK_TRAINEES;
    const parsed = JSON.parse(raw) as { trainees?: Trainee[] };
    if (!Array.isArray(parsed.trainees) || parsed.trainees.length === 0) return MOCK_TRAINEES;
    // Merge persisted trainee overrides onto the canonical mock roster so new
    // fields from mockData are always present even with older saved state.
    return MOCK_TRAINEES.map(mock => {
      const saved = parsed.trainees!.find(p => p.id === mock.id);
      return saved ? { ...mock, ...saved } : mock;
    });
  } catch {
    return MOCK_TRAINEES;
  }
}

function loadPersistedLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { currentLanguage?: Language };
    return parsed.currentLanguage === 'en' || parsed.currentLanguage === 'mr' || parsed.currentLanguage === 'hi'
      ? parsed.currentLanguage
      : null;
  } catch {
    return null;
  }
}

interface GlobalState {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  trainees: Trainee[];
  activeTraineeIndex: number;
  setActiveTraineeIndex: (index: number) => void;
  selectedTrainee: Trainee | null;
  setSelectedTrainee: (trainee: Trainee | null) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isLiveMobileQRModalOpen: boolean;
  setIsLiveMobileQRModalOpen: (open: boolean) => void;
  isConsentModalOpen: boolean;
  setIsConsentModalOpen: (open: boolean) => void;
  showAIStudioView: boolean;
  setShowAIStudioView: (show: boolean) => void;
  recordMilestone: (month: number, salary: number, designation: string, company: string) => void;
  ingestBotOutcome: (data: { salary: number; status: string; channel: string }) => Promise<void>;
  updateConsent: (consent: Trainee['activeConsent']) => void;
}

const GlobalStateContext = createContext<GlobalState | null>(null);

export const useGlobalState = (): GlobalState => {
  const ctx = useContext(GlobalStateContext);
  if (!ctx) {
    throw new Error('useGlobalState must be used within <GlobalStateProvider>');
  }
  return ctx;
};

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publish } = useLiveEvents();

  const [currentRole, setCurrentRoleState] = useState<Role>('state_admin');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => loadPersistedLanguage() ?? 'en');
  const [trainees, setTrainees] = useState<Trainee[]>(loadPersistedTrainees);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isLiveMobileQRModalOpen, setIsLiveMobileQRModalOpen] = useState<boolean>(false);
  const [showAIStudioView, setShowAIStudioView] = useState<boolean>(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [activeTraineeIndex, setActiveTraineeIndex] = useState<number>(0);

  // Persist demo state so a live demo survives page refreshes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentRole,
        currentLanguage,
        activeTraineeIndex,
        trainees,
      }));
    } catch {
      // storage may be unavailable (private mode / quota) — demo continues without persistence
    }
  }, [currentRole, currentLanguage, activeTraineeIndex, trainees]);

  const setCurrentRole = useCallback((role: Role) => {
    setCurrentRoleState(role);
    setShowAIStudioView(false);
  }, []);

  const recordMilestone = useCallback(
    (month: number, salary: number, designation: string, company: string) => {
      setTrainees(prev => prev.map((t, idx) => {
        if (idx === activeTraineeIndex) {
          const milestoneMonth = month as LongitudinalRecord['month'];
          const updatedTimeline: LongitudinalRecord[] = [
            ...t.longitudinalTimeline,
            {
              month: milestoneMonth,
              timestamp: '2026-03-01',
              status: 'employed_formal',
              companyName: company,
              designation,
              monthlySalary: salary,
              epfoUanMatched: true,
              verificationStatus: 'verified_triangulated',
              trustScore: 100,
              channelUsed: 'pwa_portal',
              attritionRiskScore: 10,
            },
          ];

          return {
            ...t,
            currentSalary: salary,
            currentEmployer: company,
            currentDesignation: designation,
            skillCoins: t.skillCoins + 50,
            overallTrustScore: 100,
            longitudinalTimeline: updatedTimeline,
          };
        }
        return t;
      }));

      const trainee = trainees[activeTraineeIndex];
      publish({
        tone: 'success',
        title: 'Career Milestone Recorded',
        message: `${trainee?.fullName ?? 'Trainee'} • ${company} • ${formatINR(salary)}/mo — +50 SkillCoins`,
      });
    },
    [activeTraineeIndex, trainees, publish]
  );

  const ingestBotOutcome = useCallback(
    async (data: { salary: number; status: string; channel: string }) => {
      try {
        const res = await ingestTelemetry({
          traineeId: trainees[0]?.id,
          month: 24,
          status: data.status,
          monthlySalary: data.salary,
          designation: 'Verified Specialist',
          companyName: 'Triangulated Employer',
          channelUsed: data.channel,
        });

        setTrainees(prev => prev.map((t, idx) => {
          if (idx === 0) {
            const newRecord: LongitudinalRecord = {
              month: 24,
              timestamp: res.record.timestamp,
              status: 'employed_formal',
              companyName: 'Verified Employer',
              designation: 'Specialist',
              monthlySalary: data.salary,
              epfoUanMatched: true,
              verificationStatus: res.record.verificationStatus,
              trustScore: res.trustScore,
              channelUsed: data.channel as LongitudinalRecord['channelUsed'],
              attritionRiskScore: 15,
            };
            return {
              ...t,
              currentSalary: data.salary,
              skillCoins: t.skillCoins + res.skillCoinsAwarded,
              overallTrustScore: res.trustScore,
              longitudinalTimeline: [...t.longitudinalTimeline, newRecord],
            };
          }
          return t;
        }));

        publish({
          tone: 'success',
          title: 'Follow-Up Outcome Synced via Telemetry',
          message: `Channel: ${data.channel} • ${formatINR(data.salary)}/mo • Audit ${res.dpdpAuditToken}`,
        });
      } catch (err) {
        publish({
          tone: 'warning',
          title: 'Telemetry Ingestion Failed',
          message: err instanceof Error ? err.message : 'Telemetry simulation failed',
        });
      }
    },
    [trainees, publish]
  );

  const updateConsent = useCallback(
    (consent: Trainee['activeConsent']) => {
      setTrainees(prev => prev.map((t, idx) => {
        if (idx === (activeTraineeIndex || 0)) {
          return { ...t, activeConsent: consent };
        }
        return t;
      }));
      publish({
        tone: 'info',
        title: 'DPDP Consent Vault Updated',
        message: `Token ${consent.consentToken} refreshed • Updated ${consent.lastConsentDate}`,
      });
    },
    [activeTraineeIndex, publish]
  );

  return (
    <GlobalStateContext.Provider
      value={{
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
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};