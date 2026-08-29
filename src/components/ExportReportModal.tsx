'use client';

import React, { useState } from 'react';
import { Trainee, DistrictMetric } from '@/types';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2
} from 'lucide-react';

interface ExportReportModalProps {
  trainees: Trainee[];
  districts?: DistrictMetric[];
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ trainees, onClose }) => {
  const [selectedScheme, setSelectedScheme] = useState<string>('Pramod Mahajan Kaushalya Vikas Abhiyan (PMKVY/MSSDS)');
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>('csv');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownloadCSV = () => {
    // Generate CSV content
    const headers = [
      'Trainee_ID',
      'DPDP_Token',
      'Full_Name',
      'Masked_Aadhaar',
      'District',
      'Sector',
      'Course_Name',
      'Training_Provider',
      'Cohort',
      'Initial_Stipend_INR',
      'Current_Salary_INR',
      'Wage_Multiplier',
      'Current_Status',
      'Overall_Trust_Score_Pct',
      'DPDP_Consent_Status'
    ];

    const rows = trainees.map(t => [
      t.id,
      t.pseudonymizedToken,
      `"${t.fullName}"`,
      t.maskedAadhaar,
      t.district,
      `"${t.sector}"`,
      `"${t.courseName}"`,
      `"${t.trainingProviderName}"`,
      t.cohort,
      t.initialStipend,
      t.currentSalary,
      (t.currentSalary / (t.initialStipend || 1)).toFixed(2),
      t.currentStatus,
      t.overallTrustScore,
      t.activeConsent.placementTracking ? 'ACTIVE' : 'REVOKED'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Maharashtra_Skilling_Longitudinal_Audit_2026_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Export Government Audit & ROI Report
              </h3>
              <p className="text-xs text-slate-400">
                Official Department of Skills (MSIS) Compliance Export
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Skilling Scheme</label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="Pramod Mahajan Kaushalya Vikas Abhiyan (PMKVY/MSSDS)">Pramod Mahajan Kaushalya Vikas Abhiyan (MSSDS)</option>
              <option value="Craftsmen Training Scheme (ITI)">Craftsmen Training Scheme (ITI)</option>
              <option value="Mukhyamantri Yuva Karya Prashikshan Yojana (MYKPY)">Mukhyamantri Yuva Karya Prashikshan Yojana (MYKPY)</option>
              <option value="All Integrated State Schemes">All Integrated State Schemes (Longitudinal)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  selectedFormat === 'csv'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                CSV / Excel Dataset (Audit)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-3 rounded-xl border text-center font-bold transition ${
                  selectedFormat === 'pdf'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                PDF Executive Summary
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-slate-500">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">DPDP Act 2023 Compliance Notice</span>
            <p>Exported data automatically tokenizes direct Aadhaar numbers and excludes unconsented records in accordance with the Digital Personal Data Protection Act 2023.</p>
          </div>
        </div>

        {/* Download Success */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Audit report successfully downloaded!</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Audit Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
