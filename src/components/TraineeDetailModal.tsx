'use client';

import React from 'react';
import { Trainee } from '@/types';
import { formatINR, getStatusBadgeInfo } from '@/lib/utils';
import { 
  X, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';

interface TraineeDetailModalProps {
  trainee: Trainee;
  onClose: () => void;
}

export const TraineeDetailModal: React.FC<TraineeDetailModalProps> = ({ trainee, onClose }) => {
  const statusInfo = getStatusBadgeInfo(trainee.currentStatus);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              {trainee.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                  {trainee.fullName}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Token: {trainee.pseudonymizedToken} • Aadhaar: {trainee.maskedAadhaar} • {trainee.district}, MH
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skilling & Education Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-400 block">Training Institute</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{trainee.trainingProviderName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Course Name</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{trainee.courseName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Cohort Batch</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{trainee.cohort}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Initial Stipend</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatINR(trainee.initialStipend)}/mo</span>
          </div>
          <div>
            <span className="text-slate-400 block">Current Salary</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {trainee.currentSalary > 0 ? formatINR(trainee.currentSalary) : 'Unemployed'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Overall Trust Score</span>
            <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{trainee.overallTrustScore}%</span>
          </div>
        </div>

        {/* Longitudinal History */}
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>Longitudinal Outcome Checkpoints (3, 6, 12, 24 Months)</span>
          </h4>

          <div className="space-y-3">
            {trainee.longitudinalTimeline.map((rec, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Month {rec.month} Follow-Up • {rec.timestamp}
                  </span>
                  <span className="text-slate-500">
                    {rec.companyName || 'Self-Employed'} — {rec.designation || 'Specialist'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 block">
                    {rec.monthlySalary ? formatINR(rec.monthlySalary) : 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Via {rec.channelUsed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DPDP Consent Status */}
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DPDP Act 2023 Consent Token</span>
            </span>
            <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
              {trainee.activeConsent.consentToken}
            </span>
          </div>
          <p className="text-emerald-800/80 dark:text-emerald-300/80 text-[11px]">
            Placement tracking: Active • Wage research: Active • Employer direct match: Active • Triangulation: Active
          </p>
        </div>
      </div>
    </div>
  );
};
