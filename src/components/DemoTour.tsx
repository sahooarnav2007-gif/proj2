'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGlobalState } from '@/lib/globalState';
import { Compass, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

type TourStepId = 'start' | 'state' | 'tp' | 'ai' | 'trainee' | 'sims' | 'employer' | 'end';

interface TourStep {
  id: TourStepId;
  title: string;
  body: string;
  role?: 'state_admin' | 'training_provider' | 'employer' | 'trainee' | 'simulators' | 'ai_studio';
}

const STORAGE_KEY = 'skill-sync-tour';

const STEPS: TourStep[] = [
  {
    id: 'start',
    title: 'Welcome to Skill Sync',
    body: 'A trilingual (English / मराठी / हिंदी) SIH 2026 platform tracking post-training employment outcomes across all 36 Maharashtra districts.',
  },
  {
    id: 'state',
    title: 'State Policy Cockpit',
    body: 'Longitudinal KPIs — 6-month retention, wage multipliers and triangulation trust — live on a GIS map with 6-division drilldowns.',
    role: 'state_admin',
  },
  {
    id: 'tp',
    title: 'Training Provider ROI Scorecard',
    body: 'Every TP & ITI gets a longitudinal ROI scorecard with placement, retention and salary-multiplier ranking.',
    role: 'training_provider',
  },
  {
    id: 'ai',
    title: 'Predictive AI Studio',
    body: 'Drag salary, commute and shift sliders — Random Forest exit-risk, an intervention order and SHAP attribution recompute in real time.',
    role: 'ai_studio',
  },
  {
    id: 'trainee',
    title: 'Trainee Cockpit & DPDP Vault',
    body: 'Wage-growth charts, QR-verifiable credentials and a consent ledger built to the DPDP Act 2023.',
    role: 'trainee',
  },
  {
    id: 'sims',
    title: 'Multi-Channel Simulators',
    body: 'WhatsApp, IVR (2G-ready), USSD and PWA follow-up channels, plus a 50k-trainee load bench.',
    role: 'simulators',
  },
  {
    id: 'employer',
    title: 'Employer Triangulation Hub',
    body: 'One-click EPFO/Udyam lookup, confirm or dispute claims, and bulk HRMS reconciliation.',
    role: 'employer',
  },
  {
    id: 'end',
    title: "That's the Skill Sync loop",
    body: 'DPDP-compliant, trilingual, print-to-PDF, and it runs with a live backend or fully offline. Explore freely below!',
  },
];

type DismissState = 'loading' | 'dismissed' | 'done';

export const DemoTour: React.FC = () => {
  const { setCurrentRole } = useGlobalState();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState<DismissState>('loading');
  const highlightIdRef = useRef<string | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable — tour continues without persistence
    }
    const isFirstVisit = stored !== 'dismissed' && stored !== 'done';
    setDismissed(isFirstVisit ? 'loading' : stored === 'dismissed' ? 'dismissed' : 'done');
    const t = setTimeout(() => {
      if (isFirstVisit) setOpen(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const clearHighlight = useCallback(() => {
    if (highlightIdRef.current) {
      document.querySelectorAll('[data-tour].tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
      highlightIdRef.current = null;
    }
  }, []);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, next));
    setIndex(clamped);
    const step = STEPS[clamped];
    if (step.id === 'end') return;

    if (step.role) setCurrentRole(step.role);

    const target = document.querySelector(`[data-tour="${step.id}"]`) as HTMLElement | null;
    clearHighlight();
    if (target) {
      highlightIdRef.current = step.id;
      target.classList.add('tour-highlight');
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [setCurrentRole, clearHighlight]);

  useEffect(() => {
    if (open) goTo(index);
    return clearHighlight;
  }, [open, index, goTo, clearHighlight]);

  const close = useCallback(() => {
    setOpen(false);
    clearHighlight();
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // ignore persistence failures
    }
    setDismissed('dismissed');
  }, [clearHighlight]);

  const finish = useCallback(() => {
    setOpen(false);
    clearHighlight();
    try {
      window.localStorage.setItem(STORAGE_KEY, 'done');
    } catch {
      // ignore persistence failures
    }
    setDismissed('done');
  }, [clearHighlight]);

  if (dismissed === 'loading') return null;

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-4 py-2.5 shadow-xl border border-white/10 hover:scale-105 active:scale-95 transition print:hidden"
          aria-label="Start guided demo tour"
        >
          <Compass className="w-4 h-4 text-orange-500" />
          <span>{dismissed === 'done' ? 'Guided Tour' : 'Start Guided Tour'}</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="demo-tour-title"
          className="fixed bottom-4 right-4 z-[85] w-[min(92vw,26rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 print:hidden"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
              <Compass className="w-3.5 h-3.5" />
              Skill Sync · SIH 2026 Demo Tour
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                {index + 1}/{STEPS.length}
              </span>
              <button
                onClick={close}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition p-0.5"
                aria-label="Dismiss tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 id="demo-tour-title" className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
            {step.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{step.body}</p>

          <div className="flex items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-5 bg-orange-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
              {isLast ? (
                <button
                  onClick={finish}
                  className="flex items-center gap-1.5 text-xs font-black text-white bg-orange-600 hover:bg-orange-700 px-3.5 py-1.5 rounded-lg shadow-md shadow-orange-600/20 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Start Exploring
                </button>
              ) : (
                <button
                  onClick={() => goTo(index + 1)}
                  className="flex items-center gap-1.5 text-xs font-black text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 px-3.5 py-1.5 rounded-lg transition"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};