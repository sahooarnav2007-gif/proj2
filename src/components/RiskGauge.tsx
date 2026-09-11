'use client';

import React from 'react';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  Low: '#10b981',
  Moderate: '#2563eb',
  High: '#f59e0b',
  Critical: '#e11d48',
};

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level }) => {
  const color = RISK_LEVEL_COLORS[level];
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="relative w-56 mx-auto">
      <svg viewBox="0 0 200 110" className="w-full" role="img" aria-label={`${clamped}% exit risk`}>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          pathLength="100"
          className="text-slate-200 dark:text-slate-700"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          pathLength="100"
          strokeDasharray={`${clamped} 100`}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dasharray 0.7s cubic-bezier(0.22,1,0.36,1)',
            filter: `drop-shadow(0 0 6px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
        <span className="text-4xl font-black tabular-nums leading-none" style={{ color }}>
          {clamped}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1.5">
          {level} Risk
        </span>
      </div>
    </div>
  );
};