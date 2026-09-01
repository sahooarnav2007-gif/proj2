'use client';

import React, { useState, useMemo } from 'react';
import { Trainee, Language } from '@/types';
import { formatINR, getStatusBadgeInfo } from '@/lib/utils';
import { 
  Users, 
  Send, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface TrainingProviderPortalProps {
  currentLanguage?: Language;
  trainees: Trainee[];
  onSelectTrainee: (trainee: Trainee) => void;
  onOpenSimulators: () => void;
}

export const TrainingProviderPortal: React.FC<TrainingProviderPortalProps> = ({
  trainees,
  onSelectTrainee,
  onOpenSimulators
}) => {
  const [selectedCohort, setSelectedCohort] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [campaignSuccessMsg, setCampaignSuccessMsg] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  // Filtered trainees list
  const filteredTrainees = useMemo(() => {
    return trainees.filter(t => {
      const matchCohort = selectedCohort === 'All' || t.cohort === selectedCohort;
      const matchStatus = selectedStatus === 'All' || t.currentStatus === selectedStatus;
      const matchSearch = 
        t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.maskedAadhaar.includes(searchQuery) ||
        t.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.pseudonymizedToken.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCohort && matchStatus && matchSearch;
    });
  }, [trainees, selectedCohort, selectedStatus, searchQuery]);

  // High risk candidates
  const highRiskTrainees = useMemo(() => {
    return trainees.filter(t => t.attritionRisk.level === 'High' || t.attritionRisk.level === 'Critical');
  }, [trainees]);

  const handleTriggerReengagement = (channel: string) => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setCampaignSuccessMsg(`🚀 Automated follow-up campaign dispatched via ${channel} to 248 pending trainees across Maharashtra!`);
      setTimeout(() => setCampaignSuccessMsg(null), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Training Provider (ITI / TP) Cockpit
              </span>
              <span className="text-slate-400 text-xs">
                Government ITI Aundh, Pune & Empaneled Centers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trainee Longitudinal Engagement & Placement Interventions
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Monitor cohort retention milestones (Day 90, 180, 365, 730), trigger AI re-engagement bots for lost contacts, and resolve early attrition risks before job loss occurs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleTriggerReengagement('WhatsApp Interactive Bot (Marathi/Hindi/Eng)')}
              disabled={isDispatching}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isDispatching ? 'Dispatching...' : 'Dispatch Automated WhatsApp Cadence'}</span>
            </button>
            <button
              onClick={onOpenSimulators}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Test Bot Simulator</span>
            </button>
          </div>
        </div>

        {/* Campaign Notification */}
        {campaignSuccessMsg && (
          <div className="mt-4 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{campaignSuccessMsg}</span>
          </div>
        )}

        {/* 4 Quick Stat Banners */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Active Cohorts Under Tracking</span>
            <span className="text-2xl font-black text-white mt-1 block">8 Batches</span>
            <span className="text-[11px] text-slate-300">2023-Q1 to 2025-Q1</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Contact Continuity Rate</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">94.8%</span>
            <span className="text-[11px] text-emerald-300">Via WhatsApp + IVR multi-fallback</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Triangulated Verified Placements</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block">86.2%</span>
            <span className="text-[11px] text-cyan-300">EPFO / Employer Match</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Attrition Risk Flagged</span>
            <span className="text-2xl font-black text-rose-400 mt-1 block">{highRiskTrainees.length} Trainees</span>
            <span className="text-[11px] text-rose-300">Needs counselor intervention</span>
          </div>
        </div>
      </div>

      {/* High Attrition Early Warning Queue */}
      {highRiskTrainees.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                ⚠️ AI Early Warning: High Attrition Risk Candidates (Counselor Action Queue)
              </h3>
            </div>
            <span className="text-xs font-bold bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-3 py-1 rounded-full">
              {highRiskTrainees.length} Action Needed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highRiskTrainees.map((t) => (
              <div 
                key={t.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-rose-200 dark:border-rose-900/50 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{t.fullName}</span>
                    <span className="text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded">
                      Risk: {t.attritionRisk.score}% ({t.attritionRisk.level})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.courseName} • {t.district}</p>
                  
                  <div className="mt-2 text-xs bg-rose-50/60 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40 space-y-1">
                    <p className="text-slate-800 dark:text-slate-200">
                      <span className="font-semibold text-rose-700 dark:text-rose-400">Factor:</span> {t.attritionRisk.primaryRiskFactor}
                    </p>
                    <p className="text-slate-800 dark:text-slate-200">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Action:</span> {t.attritionRisk.recommendedIntervention}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">{t.mobile}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTrainee(t)}
                      className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition"
                    >
                      View Longitudinal File
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trainee Master Directory & Tracking Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Trainee Longitudinal Roster & Triangulation Status
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any candidate to inspect their complete 3, 6, 12, 24-month trajectory, salary progression, and DPDP consent logs.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, course, token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-9 pr-3 py-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Cohorts</option>
              <option value="2024-Q1">2024-Q1</option>
              <option value="2024-Q2">2024-Q2</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="employed_formal">Employed Formal (EPFO)</option>
              <option value="self_employed">Self-Employed (Udyam)</option>
              <option value="unemployed_seeking">Unemployed Seeking</option>
            </select>
          </div>
        </div>

        {/* Trainee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-3 px-4">Trainee & Token</th>
                <th className="py-3 px-3">Course & Sector</th>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Current Wage</th>
                <th className="py-3 px-3 text-center">Trust Score</th>
                <th className="py-3 px-3 text-center">DPDP Consent</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTrainees.map((t) => {
                const statusInfo = getStatusBadgeInfo(t.currentStatus);
                return (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {t.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{t.maskedAadhaar}</span>
                        <span>•</span>
                        <span className="text-blue-500">{t.pseudonymizedToken}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {t.courseName}
                      </div>
                      <div className="text-[10px] text-slate-500">{t.sector} • {t.cohort}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                      {t.district}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900 dark:text-white">
                      {t.currentSalary > 0 ? formatINR(t.currentSalary) : <span className="text-slate-400 font-normal">Unemployed</span>}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        t.overallTrustScore >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        t.overallTrustScore >= 75 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {t.overallTrustScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {t.activeConsent.placementTracking ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-200">
                          Active ✓
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          Revoked
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onSelectTrainee(t)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
