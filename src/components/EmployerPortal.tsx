'use client';

import React, { useState } from 'react';
import { Language, EmployerVerificationItem } from '@/types';
import { translations, formatINR } from '@/lib/utils';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  UploadCloud, 
  FileCheck, 
  ShieldAlert, 
  MessageSquarePlus, 
  Building, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EmployerPortalProps {
  currentLanguage: Language;
  initialQueue: EmployerVerificationItem[];
}

export const EmployerPortal: React.FC<EmployerPortalProps> = ({
  currentLanguage,
  initialQueue
}) => {
  const t = translations[currentLanguage];

  const [queue, setQueue] = useState<EmployerVerificationItem[]>(initialQueue);
  const [selectedItem, setSelectedItem] = useState<EmployerVerificationItem | null>(null);
  const [bulkUploadMsg, setBulkUploadMsg] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [skillFeedback, setSkillFeedback] = useState({
    sector: 'Automotive & EV',
    skillGap: 'Trainees lack experience in live High-Voltage Battery BMS diagnostics and CAN-bus troubleshooting.',
    recommendedHours: '40 hours of hands-on simulation',
    companyName: 'Tata Motors Passenger Vehicles Ltd'
  });

  const handleVerify = (id: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          verificationStatus: 'Verified',
          triangulationMatchScore: 100,
          hrRemarks: 'Verified by HR Manager via Skill Sync Employer Portal.'
        };
      }
      return item;
    }));
  };

  const handleDispute = (id: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          verificationStatus: 'Disputed',
          triangulationMatchScore: 40,
          hrRemarks: 'Discrepancy reported: Candidate is not currently on active payroll.'
        };
      }
      return item;
    }));
  };

  const handleBulkUploadSim = () => {
    setBulkUploadMsg('Processing 120 employee payroll records from HRMS API...');
    setTimeout(() => {
      setBulkUploadMsg('✅ Successfully verified 114 active skilling alumni across Pune & Waluj facilities. 6 discrepancies flagged for review.');
      setTimeout(() => setBulkUploadMsg(null), 6000);
    }, 1500);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Employer & Industry Triangulation Hub
              </span>
              <span className="text-slate-400 text-xs font-medium">
                Tata Motors • Endurance Technologies • LTIMindtree • MSME Network
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One-Click Skilling Outcome Verification & Skill Gap Feedback
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Employers effortlessly confirm active employment, validate wage progression without exposing proprietary HRMS data, and send direct skill feedback to the Department of Skills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkUploadSim}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-teal-600/20 transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Bulk HRMS / CSV Verification</span>
            </button>
          </div>
        </div>

        {bulkUploadMsg && (
          <div className="mt-4 bg-teal-500/20 border border-teal-400 text-teal-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce">
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>{bulkUploadMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Pending HR Verifications</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {queue.filter(q => q.verificationStatus === 'Pending').length} Trainees
            </span>
            <span className="text-[11px] text-slate-300">Requires 1-click confirmation</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Verified This Quarter</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {queue.filter(q => q.verificationStatus === 'Verified').length} Trainees
            </span>
            <span className="text-[11px] text-emerald-300">Triangulation score 98%+</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Average Retention at 12M</span>
            <span className="text-2xl font-black text-white mt-1 block">84.2%</span>
            <span className="text-[11px] text-slate-300">In formal manufacturing & IT</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <span className="text-slate-300 text-xs block">Discrepancy Resolution</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block">&lt; 48 Hours</span>
            <span className="text-[11px] text-cyan-300">Direct TP notification</span>
          </div>
        </div>
      </div>

      {/* Verification Queue & Triangulation Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Trainee Employment Verification Queue
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Confirm or report discrepancies on trainee-claimed employment, designation, and salary.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-3 px-4">Trainee & Aadhaar</th>
                <th className="py-3 px-3">Skilling Institute</th>
                <th className="py-3 px-3">Claimed Role & Joining</th>
                <th className="py-3 px-3 text-right">Claimed Wage</th>
                <th className="py-3 px-3 text-center">Triangulation Match</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.traineeName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.maskedAadhaar} • UAN: {item.claimedUAN || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.courseName}
                    </div>
                    <div className="text-[10px] text-slate-500">{item.trainingProviderName}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{item.claimedDesignation}</div>
                    <div className="text-[10px] text-slate-500">Joined: {item.claimedJoinDate}</div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-slate-900 dark:text-white">
                    {formatINR(item.claimedSalary)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                      item.triangulationMatchScore >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      item.triangulationMatchScore >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {item.triangulationMatchScore}% Match
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      item.verificationStatus === 'Verified' ? 'bg-emerald-500 text-white' :
                      item.verificationStatus === 'Disputed' ? 'bg-rose-600 text-white' :
                      'bg-amber-500 text-white'
                    }`}>
                      {item.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {item.verificationStatus === 'Pending' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleVerify(item.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold text-xs flex items-center gap-1 transition"
                          title="Confirm Employment"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => handleDispute(item.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded font-bold text-xs flex items-center gap-1 transition"
                          title="Report Discrepancy"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dispute</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        {item.verificationStatus === 'Verified' ? '✓ Verified' : '⚠ Disputed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Industry Skill Gap Feedback Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Direct Industry-to-Government Skill Gap Feedback
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tell MSIS curriculum boards which tools, safety protocols, or soft skills recent trainees are lacking on the job.
            </p>
          </div>
        </div>

        {feedbackSubmitted && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your skill gap feedback has been ingested by the MSIS AI Topic Modeling Engine to update the 2026-27 state curriculum.</span>
          </div>
        )}

        <form onSubmit={handleFeedbackSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company / Organization Name</label>
            <input
              type="text"
              value={skillFeedback.companyName}
              onChange={(e) => setSkillFeedback({ ...skillFeedback, companyName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sector</label>
            <select
              value={skillFeedback.sector}
              onChange={(e) => setSkillFeedback({ ...skillFeedback, sector: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="Automotive & EV">Automotive & EV</option>
              <option value="IT/ITeS & Cloud">IT/ITeS & Cloud</option>
              <option value="Precision Engineering & CNC">Precision Engineering & CNC</option>
              <option value="Solar & Green Energy">Solar & Green Energy</option>
              <option value="Healthcare & Nursing">Healthcare & Nursing</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Specific Skill Deficiency Observed</label>
            <textarea
              rows={3}
              value={skillFeedback.skillGap}
              onChange={(e) => setSkillFeedback({ ...skillFeedback, skillGap: e.target.value })}
              placeholder="e.g. Trainees lack hands-on experience with modern 5-axis CNC G-code optimization..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-xl transition shadow-md"
            >
              Submit Curriculum Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
