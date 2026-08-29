'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Store, 
  Search, 
  CheckCircle2, 
  Database
} from 'lucide-react';

interface VerificationResult {
  status: string;
  identifier: string;
  establishmentName: string;
  establishmentId: string;
  lastContributionMonth: string;
  wageBracket: string;
  tenureMonths: string;
  trustScore: number;
  dpdpHash: string;
  triangulationSignal: string;
}

export const EPFOVerificationSandbox: React.FC = () => {
  const [verifyType, setVerifyType] = useState<'uan' | 'udyam' | 'naps'>('uan');
  const [queryId, setQueryId] = useState<string>('100984128912');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>({
    status: 'ACTIVE_VERIFIED',
    identifier: '100984128912 (Universal Account Number)',
    establishmentName: 'Tata Motors Passenger Vehicles Ltd',
    establishmentId: 'MH/PUN/0014298/000',
    lastContributionMonth: 'January 2026',
    wageBracket: '₹30,000 - ₹35,000 / month',
    tenureMonths: '22 Months Continuous',
    trustScore: 98,
    dpdpHash: 'SHA256-0x9812A4FE8201',
    triangulationSignal: 'POSITIVE_FORMAL_EMPLOYMENT'
  });

  const handleRunLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (verifyType === 'uan') {
        setVerificationResult({
          status: 'ACTIVE_VERIFIED',
          identifier: `${queryId} (Universal Account Number)`,
          establishmentName: 'Tata Motors Passenger Vehicles Ltd',
          establishmentId: 'MH/PUN/0014298/000',
          lastContributionMonth: 'January 2026',
          wageBracket: '₹30,000 - ₹35,000 / month',
          tenureMonths: '22 Months Continuous',
          trustScore: 98,
          dpdpHash: 'SHA256-0x9812A4FE8201',
          triangulationSignal: 'POSITIVE_FORMAL_EMPLOYMENT'
        });
      } else if (verifyType === 'udyam') {
        setVerificationResult({
          status: 'ACTIVE_VERIFIED',
          identifier: `${queryId} (Ministry of MSME)`,
          establishmentName: 'M/s Jadhav Solar & Electrical Services',
          establishmentId: 'UDYAM-MH-23-0089124',
          lastContributionMonth: 'GST Returns Filed Q3 2025',
          wageBracket: 'Micro Enterprise (₹2.5L - ₹5L Annual Turnover)',
          tenureMonths: '18 Months Active',
          trustScore: 94,
          dpdpHash: 'SHA256-0x34AC7719B502',
          triangulationSignal: 'POSITIVE_SELF_EMPLOYMENT'
        });
      } else {
        setVerificationResult({
          status: 'ACTIVE_VERIFIED',
          identifier: `${queryId} (National Apprenticeship Promotion Scheme)`,
          establishmentName: 'Mahindra & Mahindra Ltd, Igatpuri',
          establishmentId: 'NAPS-CONTRACT-MH-2024-998',
          lastContributionMonth: 'Stipend DBT Credited Dec 2025',
          wageBracket: '₹14,000 / month Govt Co-funded',
          tenureMonths: '11 Months Completed',
          trustScore: 96,
          dpdpHash: 'SHA256-0x88EE1194C012',
          triangulationSignal: 'POSITIVE_APPRENTICESHIP'
        });
      }
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              EPFO, Udyam & NAPS Triangulation Signal Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test instant cryptographic validation against national registries without capturing sensitive financial PII.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => { setVerifyType('uan'); setQueryId('100984128912'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              verifyType === 'uan' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>EPFO / UAN (Formal)</span>
          </button>
          <button
            onClick={() => { setVerifyType('udyam'); setQueryId('UDYAM-MH-23-0089124'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              verifyType === 'udyam' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Udyam (Self-Employed)</span>
          </button>
          <button
            onClick={() => { setVerifyType('naps'); setQueryId('NAPS-MH-2024-998'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              verifyType === 'naps' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>NAPS (Apprentice)</span>
          </button>
        </div>
      </div>

      {/* Input Query Bar */}
      <form onSubmit={handleRunLookup} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            required
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            placeholder="Enter UAN (12 digits), Udyam Number, or NAPS Contract ID..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          {isLoading ? 'Querying Registry Gateway...' : 'Execute Triangulation Query'}
        </button>
      </form>

      {/* Result Display Box */}
      {verificationResult && (
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Verification Signal Result: {verificationResult.status}
              </span>
            </div>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
              Trust Score: {verificationResult.trustScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Identifier Queried</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{verificationResult.identifier}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Establishment / Venture</span>
              <span className="font-bold text-slate-900 dark:text-white">{verificationResult.establishmentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Establishment Code / Reg No</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{verificationResult.establishmentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Last Active Signal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{verificationResult.lastContributionMonth}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Verified Wage Bracket</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{verificationResult.wageBracket}</span>
            </div>
            <div>
              <span className="text-slate-500 block">DPDP Act Compliance Hash</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400">{verificationResult.dpdpHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
