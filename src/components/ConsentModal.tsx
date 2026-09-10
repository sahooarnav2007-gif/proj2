'use client';

import React, { useState } from 'react';
import { Trainee } from '@/types';
import { X, ShieldCheck, Lock, Save, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

interface ConsentApiResponse {
  success: boolean;
  action: string;
  traineeId: string;
  consentToken: string;
  ledgerHash: string;
  timestamp: string;
  dpdpComplianceStatus: string;
}

interface ConsentModalProps {
  trainee: Trainee;
  onClose: () => void;
  onSave: (consent: Trainee['activeConsent']) => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ trainee, onClose, onSave }) => {
  const [consent, setConsent] = useState({
    placementTracking: trainee.activeConsent.placementTracking,
    wageResearchAnonymized: trainee.activeConsent.wageResearchAnonymized,
    employerDirectMatching: trainee.activeConsent.employerDirectMatching,
    epfoAadhaarTriangulation: trainee.activeConsent.epfoAadhaarTriangulation,
  });

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const toggle = (key: keyof typeof consent) => {
    setConsent(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await apiFetch<ConsentApiResponse>('/api/consent', {
        method: 'POST',
        body: JSON.stringify({
          traineeId: trainee.id,
          placementTracking: consent.placementTracking,
          wageResearchAnonymized: consent.wageResearchAnonymized,
          employerDirectMatching: consent.employerDirectMatching,
          epfoAadhaarTriangulation: consent.epfoAadhaarTriangulation,
          action: 'grant',
        }),
      });

      onSave({
        ...consent,
        lastConsentDate: new Date().toISOString().split('T')[0],
        consentToken: res.consentToken,
      });
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update consent');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                DPDP Act 2023 Consent Vault
              </h3>
              <p className="text-xs text-slate-400">
                Manage data sharing permissions for {trainee.fullName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent Toggles */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Longitudinal Placement Follow-Up</span>
              <span className="text-slate-500 text-[11px]">Automated 6M/12M check-ins via WhatsApp & IVR</span>
            </div>
            <input
              type="checkbox"
              checked={consent.placementTracking}
              onChange={() => toggle('placementTracking')}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Anonymized Wage Research</span>
              <span className="text-slate-500 text-[11px]">Aggregated wage multiplier benchmarks for MSIS policy</span>
            </div>
            <input
              type="checkbox"
              checked={consent.wageResearchAnonymized}
              onChange={() => toggle('wageResearchAnonymized')}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Direct Employer Matching</span>
              <span className="text-slate-500 text-[11px]">Allow top Maharashtra recruiters to view your skill badge</span>
            </div>
            <input
              type="checkbox"
              checked={consent.employerDirectMatching}
              onChange={() => toggle('employerDirectMatching')}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">EPFO & DigiLocker Triangulation</span>
              <span className="text-slate-500 text-[11px]">Cryptographic verification without manual salary slips</span>
            </div>
            <input
              type="checkbox"
              checked={consent.epfoAadhaarTriangulation}
              onChange={() => toggle('epfoAadhaarTriangulation')}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Token & Compliance */}
        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Consent Token</span>
            </span>
            <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
              {trainee.activeConsent.consentToken}
            </span>
          </div>
          <p className="text-emerald-800/80 dark:text-emerald-300/80 text-[11px]">
            Tamper-proof ledger entry. Changes are cryptographically logged per DPDP Act 2023 Section 8.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {saveError && (
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex-1">
              {saveError}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-xs disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved || isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Consent Updated!' : isSaving ? 'Tokenizing Ledger Entry...' : 'Save Consent Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
