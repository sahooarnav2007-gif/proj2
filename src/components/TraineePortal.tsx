'use client';

import React, { useState } from 'react';
import { Trainee } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  Coins, 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles, 
  Smartphone
} from 'lucide-react';

interface TraineePortalProps {
  trainee: Trainee;
  onUpdateMilestone: (month: number, salary: number, designation: string, company: string) => void;
  onOpenConsentModal?: () => void;
  onOpenSimulators: () => void;
}

export const TraineePortal: React.FC<TraineePortalProps> = ({
  trainee,
  onUpdateMilestone,
  onOpenConsentModal,
  onOpenSimulators
}) => {
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [newMonth, setNewMonth] = useState<number>(24);
  const [newSalary, setNewSalary] = useState<number>(trainee.currentSalary + 5000);
  const [newDesignation, setNewDesignation] = useState<string>(trainee.currentDesignation || '');
  const [newCompany, setNewCompany] = useState<string>(trainee.currentEmployer || '');
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  const [consentState, setConsentState] = useState({
    placementTracking: trainee.activeConsent.placementTracking,
    wageResearchAnonymized: trainee.activeConsent.wageResearchAnonymized,
    employerDirectMatching: trainee.activeConsent.employerDirectMatching,
    epfoAadhaarTriangulation: trainee.activeConsent.epfoAadhaarTriangulation
  });

  const handleConsentToggle = (key: keyof typeof consentState) => {
    setConsentState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMilestone(newMonth, newSalary, newDesignation, newCompany);
    setShowUpdateModal(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Trainee Profile & Gamified SkillCoins Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/20">
              {trainee.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white">{trainee.fullName}</h2>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Aadhaar Verified</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                <span>{trainee.courseName}</span>
                <span>•</span>
                <span>{trainee.trainingProviderName}</span>
                <span>•</span>
                <span className="text-orange-400">{trainee.district}, MH</span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  Token: {trainee.pseudonymizedToken}
                </span>
                <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  Aadhaar: {trainee.maskedAadhaar}
                </span>
              </div>
            </div>
          </div>

          {/* Gamification & SkillCoins Vault */}
          <div className="flex flex-col items-end gap-2">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-slate-900 rounded-xl font-black">
                <Coins className="w-6 h-6 animate-spin-slow text-amber-950" />
              </div>
              <div>
                <span className="text-xs text-amber-200 block font-semibold">SkillCoins Earned</span>
                <span className="text-2xl font-black text-amber-300">{trainee.skillCoins} Coins</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">
              +50 Coins for each verified 6-Month career follow-up!
            </span>
          </div>
        </div>

        {updateSuccess && (
          <div className="mt-4 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>🎉 Career milestone successfully updated and synced across state skilling dashboards! +50 SkillCoins awarded.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Salary Hike / Job Transition</span>
          </button>

          <button
            onClick={onOpenSimulators}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Simulate WhatsApp Re-Engagement Chat</span>
          </button>

          {onOpenConsentModal && (
            <button
              onClick={onOpenConsentModal}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Manage DPDP Consent</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Trainee Content: Career Timeline + DPDP Privacy Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Longitudinal Career Progression Timeline */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Longitudinal Career & Wage Milestones
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified trajectory from initial training stipend to current market salary.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200">
              {(trainee.currentSalary / (trainee.initialStipend || 1)).toFixed(2)}x Wage Growth
            </span>
          </div>

          <div className="relative border-l-2 border-orange-300 dark:border-orange-900 ml-4 pl-6 space-y-6">
            {/* Initial Certification Node */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-400 border-4 border-white dark:border-slate-800"></div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Certified from {trainee.trainingProviderName}</span>
                  <span className="text-slate-400">{trainee.certificationDate}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Course: {trainee.courseName} • Starting Stipend: {formatINR(trainee.initialStipend)}/mo</p>
              </div>
            </div>

            {/* Longitudinal Nodes */}
            {trainee.longitudinalTimeline.map((rec, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white dark:border-slate-800 animate-pulse"></div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      Month {rec.month} Follow-Up
                    </span>
                    <span className="text-xs font-mono text-slate-400">{rec.timestamp}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Employer / Venture</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.companyName || 'Self-Employed'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Designation</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.designation || 'Specialist'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Monthly Salary</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {rec.monthlySalary ? formatINR(rec.monthlySalary) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Verification Channel</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {rec.channelUsed === 'whatsapp' ? '💬 WhatsApp Bot' :
                         rec.channelUsed === 'ivr_call' ? '📞 Marathi IVR Call' :
                         rec.channelUsed === 'pwa_portal' ? '🌐 Trainee Portal' : '🏢 Employer API'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{rec.verificationStatus === 'verified_triangulated' ? '100% Triangulated Match' : 'Verified'}</span>
                    </span>
                    <span className="text-slate-400">EPFO UAN Linked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DPDP Act 2023 Consent Vault & Personalized Upskilling */}
        <div className="lg:col-span-5 space-y-6">
          {/* DPDP Consent Vault */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                DPDP Act 2023 Consent Vault
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              You maintain total control over your longitudinal skilling telemetry. You may toggle or revoke purpose-bound access anytime.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Longitudinal Placement Follow-Up</span>
                  <span className="text-slate-500 text-[11px]">Automated 6M/12M check-ins via WhatsApp & IVR</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentState.placementTracking}
                  onChange={() => handleConsentToggle('placementTracking')}
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
                  checked={consentState.wageResearchAnonymized}
                  onChange={() => handleConsentToggle('wageResearchAnonymized')}
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
                  checked={consentState.employerDirectMatching}
                  onChange={() => handleConsentToggle('employerDirectMatching')}
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
                  checked={consentState.epfoAadhaarTriangulation}
                  onChange={() => handleConsentToggle('epfoAadhaarTriangulation')}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
              <span>Consent Token: {trainee.activeConsent.consentToken}</span>
              <span className="text-emerald-600 font-bold">Tamper-Proof Ledger</span>
            </div>
          </div>

          {/* Recommended Bridge Courses / Upskilling */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-850 rounded-2xl p-6 border border-orange-200 dark:border-orange-900/40 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recommended State Upskilling Bridge Courses
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Boost your salary trajectory by +25% with these sponsored weekend modules:
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-orange-200/60 shadow-xs">
                <span className="font-bold text-slate-900 dark:text-white block">Level 4: Advanced Thermal Runaway & BMS Diagnostics</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">Indo-German Tool Room / Virtual Simulator • 40 Hours</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded mt-2 inline-block">
                  100% Govt Sponsored (MSSDS)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Career Milestone Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                🚀 Report Career Milestone & Wage Hike
              </h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Updating your records keeps your verified state profile active and unlocks +50 SkillCoins!
            </p>

            <form onSubmit={handleMilestoneSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Milestone Month</label>
                <select
                  value={newMonth}
                  onChange={(e) => setNewMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value={3}>Month 3 (90-Day Check-in)</option>
                  <option value={6}>Month 6 (6-Month Follow-up)</option>
                  <option value={12}>Month 12 (Annual Review)</option>
                  <option value={24}>Month 24 (2-Year Milestone)</option>
                  <option value={36}>Month 36 (3-Year Longitudinal)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">New Monthly Take-Home Salary (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2 rounded-xl shadow-md transition"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
