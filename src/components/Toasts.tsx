'use client';

import React from 'react';
import { useLiveEvents, LiveEvent } from '@/lib/liveEvents';
import { CheckCircle2, AlertTriangle, Info, Cpu } from 'lucide-react';

const toneConfig: Record<LiveEvent['tone'], { wrap: string; icon: React.ReactNode; iconCls: string }> = {
  success: {
    wrap: 'border-emerald-500/40 bg-white dark:bg-slate-900',
    icon: <CheckCircle2 className="w-4 h-4" />,
    iconCls: 'text-emerald-500',
  },
  info: {
    wrap: 'border-sky-500/40 bg-white dark:bg-slate-900',
    icon: <Info className="w-4 h-4" />,
    iconCls: 'text-sky-500',
  },
  warning: {
    wrap: 'border-amber-500/40 bg-white dark:bg-slate-900',
    icon: <AlertTriangle className="w-4 h-4" />,
    iconCls: 'text-amber-500',
  },
  system: {
    wrap: 'border-slate-400/40 bg-white dark:bg-slate-900',
    icon: <Cpu className="w-4 h-4" />,
    iconCls: 'text-slate-500',
  },
};

export const Toasts: React.FC = () => {
  const { events } = useLiveEvents();
  if (events.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[90] flex flex-col gap-2 w-[min(92vw,22rem)] print:hidden pointer-events-none"
    >
      {events.map((ev) => {
        const cfg = toneConfig[ev.tone] ?? toneConfig.info;
        return (
          <div
            key={ev.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border shadow-lg px-3.5 py-3 animate-fade-in ${cfg.wrap}`}
          >
            <span className={`mt-0.5 shrink-0 ${cfg.iconCls}`}>{cfg.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug">{ev.title}</p>
              {ev.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug break-words">{ev.message}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};