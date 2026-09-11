'use client';

import React from 'react';
import { CheckCircle2, Info, AlertTriangle, Radio, X } from 'lucide-react';
import { useLiveEvents, LiveEvent, LiveEventTone } from '@/lib/liveEvents';

const toneStyles: Record<LiveEventTone, { icon: React.ReactNode; border: string; color: string }> = {
  success: { icon: <CheckCircle2 className="w-4 h-4" />, border: 'border-l-emerald-500', color: 'text-emerald-500' },
  info: { icon: <Info className="w-4 h-4" />, border: 'border-l-blue-500', color: 'text-blue-500' },
  warning: { icon: <AlertTriangle className="w-4 h-4" />, border: 'border-l-amber-500', color: 'text-amber-500' },
  system: { icon: <Radio className="w-4 h-4" />, border: 'border-l-purple-500', color: 'text-purple-500' },
};

const EventToast: React.FC<{ event: LiveEvent }> = ({ event }) => {
  const style = toneStyles[event.tone];
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 ${style.border} rounded-xl shadow-lg p-3 animate-fade-in`}
      role="status"
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 shrink-0 ${style.color}`}>{style.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{event.title}</p>
          {event.message && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{event.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const LiveEventTicker: React.FC = () => {
  const { events, clear } = useLiveEvents();

  if (events.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2 w-[min(22rem,calc(100vw-2rem))] print:hidden"
      aria-live="polite"
      aria-label="Live MSIS telemetry events"
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/95 dark:bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-700 shadow-lg backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono">MSIS Live Telemetry Stream</span>
        </span>
        <button
          onClick={clear}
          className="text-slate-400 hover:text-white transition"
          aria-label="Dismiss live events"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {events.map(ev => (
        <EventToast key={ev.id} event={ev} />
      ))}
    </div>
  );
};