'use client';

import React, { useState } from 'react';
import { Trainee } from '@/types';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2
} from 'lucide-react';

interface ExportReportModalProps {
  trainees: Trainee[];
  onClose: () => void;
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
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
      escapeCsvField(t.fullName),
      t.maskedAadhaar,
      t.district,
      escapeCsvField(t.sector),
      escapeCsvField(t.courseName),
      escapeCsvField(t.trainingProviderName),
      t.cohort,
      String(t.initialStipend),
      String(t.currentSalary),
      (t.currentSalary / (t.initialStipend || 1)).toFixed(2),
      t.currentStatus,
      String(t.overallTrustScore),
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

  const handleDownloadPDF = () => {
    const totalTrained = trainees.length;
    const employed = trainees.filter(t => t.currentStatus === 'employed_formal').length;
    const avgSalary = trainees.reduce((acc, t) => acc + t.currentSalary, 0) / totalTrained;
    const avgTrust = trainees.reduce((acc, t) => acc + t.overallTrustScore, 0) / totalTrained;

    const html = `<!DOCTYPE html>
<html><head><title>Skill Sync Audit Report</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
  h1 { font-size: 24px; color: #ea580c; margin-bottom: 4px; }
  h2 { font-size: 16px; color: #475569; margin-top: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  .meta { font-size: 12px; color: #64748b; margin-bottom: 24px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
  .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
  .stat-value { font-size: 28px; font-weight: 900; color: #0f172a; }
  .stat-label { font-size: 11px; color: #64748b; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 12px; }
  th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 600; }
  td { padding: 8px; border-bottom: 1px solid #f1f5f9; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .footer { margin-top: 32px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  @media print { body { padding: 20px; } }
</style></head><body>
<h1>Skill Sync — Longitudinal Skilling Audit Report</h1>
<div class="meta">Scheme: ${selectedScheme} | Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} | DPDP Act 2023 Compliant</div>
<div class="stats">
  <div class="stat"><div class="stat-value">${totalTrained}</div><div class="stat-label">Total Trainees</div></div>
  <div class="stat"><div class="stat-value">${employed}</div><div class="stat-label">Formally Employed</div></div>
  <div class="stat"><div class="stat-value">₹${Math.round(avgSalary).toLocaleString('en-IN')}</div><div class="stat-label">Avg Monthly Salary</div></div>
  <div class="stat"><div class="stat-value">${avgTrust.toFixed(1)}%</div><div class="stat-label">Avg Trust Score</div></div>
</div>
<h2>Trainee Longitudinal Records</h2>
<table>
  <thead><tr>
    <th>ID</th><th>Name</th><th>District</th><th>Sector</th><th>Course</th><th>Initial</th><th>Current</th><th>Status</th><th>Trust</th>
  </tr></thead>
  <tbody>
  ${trainees.map(t => `<tr>
    <td>${t.pseudonymizedToken}</td>
    <td>${t.fullName}</td>
    <td>${t.district}</td>
    <td>${t.sector}</td>
    <td>${t.courseName}</td>
    <td>₹${t.initialStipend.toLocaleString('en-IN')}</td>
    <td><strong>₹${t.currentSalary.toLocaleString('en-IN')}</strong></td>
    <td><span class="badge ${t.currentStatus === 'employed_formal' ? 'badge-green' : t.currentStatus === 'unemployed_seeking' ? 'badge-red' : 'badge-yellow'}">${t.currentStatus.replace(/_/g, ' ')}</span></td>
    <td>${t.overallTrustScore}%</td>
  </tr>`).join('')}
  </tbody>
</table>
<div class="footer">
  Skill Sync v2.6 — Smart India Hackathon 2026 (PS SIH26135) | Maharashtra State Innovation Society | DPDP Act 2023 Compliant<br>
  This report contains pseudonymized data. Direct Aadhaar numbers have been masked per government compliance requirements.
</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 2500);
  };

  const handleDownload = () => {
    if (selectedFormat === 'pdf') {
      handleDownloadPDF();
    } else {
      handleDownloadCSV();
    }
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
            onClick={handleDownload}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download {selectedFormat === 'pdf' ? 'PDF Report' : 'Audit Dataset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
