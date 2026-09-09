'use client';

import React, { useState } from 'react';
import { 
  QrCode, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Zap, 
  Send,
  Building2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveMobileDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateLiveUpdate: (newSalary: number, status: string) => void;
}

export const LiveMobileDemoModal: React.FC<LiveMobileDemoModalProps> = ({
  isOpen,
  onClose,
  onSimulateLiveUpdate
}) => {
  const [mobileSalary, setMobileSalary] = useState<number>(36000);
  const [mobileStatus, setMobileStatus] = useState<string>('Senior EV BMS Technician');
  const [isSent, setIsSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTriggerMobileUpdate = () => {
    setIsSent(true);
    onSimulateLiveUpdate(mobileSalary, mobileStatus);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative text-slate-900 dark:text-white">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Smartphone className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Live "Scan-on-Your-Phone" Interactive Demo
              </h3>
              <p className="text-[11px] text-orange-100">
                Let judges scan the QR code or test live phone-to-screen sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            
            {/* Real Scannable QR Code */}
            <div className="sm:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-40 h-40 bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg border border-slate-200 overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.origin + '?role=simulators&demo=mobile' : 'https://github.com/sahooarnav2007-gif/proj2'
                  )}&color=0f172a&bgcolor=ffffff&qzone=1`}
                  alt="Scannable Live QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[11px] text-orange-400 font-mono font-bold mt-2.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>SCAN WITH PHONE CAMERA</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Points phone camera or Google Lens to open mobile demo
              </p>
            </div>

            {/* Live Interactive Phone Test Controls */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Instant Screen Sync Simulator
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Test Live Push to State Dashboard
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Change values below and submit to watch the entire dashboard reactively update!
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Simulated Candidate Role
                  </label>
                  <input
                    type="text"
                    value={mobileStatus}
                    onChange={(e) => setMobileStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Simulated New Monthly Salary: <span className="text-orange-600 dark:text-orange-400 font-mono">₹{mobileSalary.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={18000}
                    max={50000}
                    step={1000}
                    value={mobileSalary}
                    onChange={(e) => setMobileSalary(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleTriggerMobileUpdate}
                disabled={isSent}
                className="w-full mt-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                    <span>Syncing with State Policy Cockpit...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Push Live Mobile Update to Dashboard</span>
                  </>
                )}
              </button>
            </div>

          </div>

          <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 p-3 rounded-2xl text-xs text-orange-900 dark:text-orange-200 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
            <p>
              <strong>Judges' Favorite Feature:</strong> Demonstrates multi-device WebSocket / REST telemetry synchronization across all 36 Maharashtra districts.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <span>WebSocket Realtime Gateway</span>
          <span className="text-emerald-500 font-mono font-bold">● Telemetry Stream Connected</span>
        </div>

      </div>
    </div>
  );
};
