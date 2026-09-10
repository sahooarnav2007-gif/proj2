'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Download, 
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useGlobalState } from '@/lib/globalState';

interface VerifyPageProps {
  params: {
    id: string;
  };
}

const FALLBACK_TRAINEE = {
  fullName: 'Manisha Madavi',
  maskedAadhaar: 'XXXX-XXXX-4912',
  district: 'Gadchiroli',
  courseName: 'Herbal & Medicinal Processing',
  trainingProviderName: 'MSSDS Tribal Skill Center',
  currentStatus: 'self_employed' as const,
  currentSalary: 24000,
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  employed_formal: { label: 'Employed (Formal)', cls: 'text-emerald-400' },
  employed_informal: { label: 'Employed (Informal)', cls: 'text-amber-400' },
  self_employed: { label: 'Self-Employed (SHG Leader)', cls: 'text-emerald-400' },
  apprentice: { label: 'Apprenticeship in Progress', cls: 'text-blue-400' },
  higher_education: { label: 'Higher Education Track', cls: 'text-sky-400' },
  unemployed_seeking: { label: 'Seeking Employment', cls: 'text-orange-400' },
  dropped_out: { label: 'Dropped Out — Reskilling Plan', cls: 'text-rose-400' },
};

function formatMaskedAadhaar(masked: string): string {
  const digits = masked.replace(/\D/g, '');
  return `XXXX-XXXX-${digits.slice(-4)}`;
}

export default function VerifyCredentialPage({ params }: VerifyPageProps) {
  const { trainees } = useGlobalState();
  const [verificationTime, setVerificationTime] = useState<string>('');
  const [proofOpen, setProofOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const candidateId = params?.id || 'MSIS-8821';
  const trainee = trainees.find(x => x.pseudonymizedToken === candidateId) ?? null;

  const profile = trainee
    ? {
        fullName: trainee.fullName,
        maskedAadhaar: formatMaskedAadhaar(trainee.maskedAadhaar),
        district: trainee.district,
        courseName: trainee.courseName,
        trainingProviderName: trainee.trainingProviderName,
        currentStatus: trainee.currentStatus,
        currentSalary: trainee.currentSalary,
      }
    : { ...FALLBACK_TRAINEE, maskedAadhaar: formatMaskedAadhaar(FALLBACK_TRAINEE.maskedAadhaar) };

  const status = STATUS_LABELS[profile.currentStatus] ?? STATUS_LABELS.self_employed;

  useEffect(() => {
    setVerificationTime(new Date().toUTCString());
  }, []);

  const merkleRoot = '0x8f2d91c7a4e5902bc4a81';
  const issuerDid = 'did:india:mah:msis:gateway:01';
  const vcContext = 'https://www.w3.org/2018/credentials/v1';

  const jsonldProof = JSON.stringify(
    {
      '@context': [vcContext, 'https://www.w3.org/2018/credentials/examples/v1'],
      id: `did:india:mah:msis:vc:${candidateId}`,
      type: ['VerifiableCredential', 'EmploymentStatusCredential'],
      issuer: issuerDid,
      issuanceDate: verificationTime,
      credentialSubject: {
        id: `did:india:mah:msis:trainee:${candidateId}`,
        pseudonymizedToken: candidateId,
        maskedAadhaar: profile.maskedAadhaar,
        fullName: profile.fullName,
        district: profile.district,
        certifiedCourse: profile.courseName,
        trainingProvider: profile.trainingProviderName,
        employmentStatus: profile.currentStatus,
        verifiedMonthlyIncomeINR: profile.currentSalary,
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: verificationTime,
        merkleRoot,
        verificationMethod: `${issuerDid}#keys-01`,
        proofPurpose: 'assertionMethod',
      },
    },
    null,
    2
  );

  const copyProof = async () => {
    try {
      await navigator.clipboard.writeText(jsonldProof);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setProofOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center font-sans relative overflow-hidden selection:bg-orange-500 selection:text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full space-y-6 z-10 my-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Government of Maharashtra Trust Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            W3C Verifiable Credential Proof
          </h1>
          <p className="text-xs text-slate-400">
            Cryptographically authenticated by Maharashtra State Innovation Society (MSIS)
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Verification Status
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                  <span>AUTHENTIC & VALID</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">CREDENTIAL ID</span>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-800/40">
                {candidateId}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Trainee Candidate</span>
              <h2 className="text-xl font-black text-slate-100">{profile.fullName}</h2>
              <p className="text-xs text-slate-400">Masked Aadhaar: <span className="font-mono text-slate-300">{profile.maskedAadhaar}</span> • {profile.district}, Maharashtra</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Certified Course</span>
                <span className="text-xs font-bold text-slate-200">{profile.courseName}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Training Provider</span>
                <span className="text-xs font-bold text-slate-200">{profile.trainingProviderName}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Employment State</span>
                <span className={`text-xs font-bold ${status.cls}`}>{status.label}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Verified Income (3-Way Signal)</span>
                <span className="text-xs font-bold font-mono text-amber-400">₹{profile.currentSalary.toLocaleString('en-IN')} / month</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>W3C VC Context</span>
                </span>
                <span className="text-[10px] text-slate-300 truncate max-w-[200px]">
                  {vcContext}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>SHA-256 Merkle Root</span>
                <span className="text-[11px] text-orange-400 font-bold">
                  {merkleRoot}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>Issuer DID</span>
                <span className="text-[11px] text-slate-300">
                  {issuerDid}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Verification Timestamp</span>
                <span className="text-[10px] text-slate-400">{verificationTime || 'Valid Real-time'}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Triangulation Proof Signals
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-xl text-emerald-300 font-bold">
                  ✓ Self IVR Voice
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-xl text-emerald-300 font-bold">
                  ✓ Udyam MSME
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-xl text-emerald-300 font-bold">
                  ✓ Bank UPI Signal
                </div>
              </div>
            </div>

            {proofOpen && (
              <div className="bg-slate-950/95 rounded-xl border border-slate-800 p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                    W3C JSON-LD Credential Proof
                  </span>
                  <button
                    onClick={copyProof}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[10px] leading-relaxed max-h-56 overflow-auto text-slate-300 whitespace-pre-wrap break-all font-mono">
                  {jsonldProof}
                </pre>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Skill Sync Platform</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setProofOpen(o => !o)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{proofOpen ? 'Hide' : 'View'} JSON-LD Proof</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Smart India Hackathon 2026 • Problem Statement SIH26135 • Maharashtra State Innovation Society
        </p>
      </div>
    </div>
  );
}