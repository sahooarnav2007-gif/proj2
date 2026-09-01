'use client';

import React from 'react';
import { Role } from '@/types';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Smartphone, 
  Bot
} from 'lucide-react';

interface RoleTabProps {
  role: Role;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  variant?: 'default' | 'emerald';
}

export const RoleTab: React.FC<RoleTabProps> = ({
  role,
  label,
  icon,
  isActive,
  onClick,
  variant = 'default'
}) => {
  const baseActive = variant === 'emerald'
    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-bold'
    : 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm';
  
  const baseInactive = variant === 'emerald'
    ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        isActive ? baseActive : baseInactive
      }`}
    >
      {icon}
      <span>{label}</span>
      {variant === 'emerald' && isActive && (
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      )}
    </button>
  );
};

export const ROLE_TAB_CONFIG: { role: Role; labelKey: string; icon: React.ReactNode; variant?: 'default' | 'emerald' }[] = [
  { role: 'state_admin', labelKey: 'role_state', icon: <Building2 className="w-4 h-4" /> },
  { role: 'training_provider', labelKey: 'role_tp', icon: <GraduationCap className="w-4 h-4" /> },
  { role: 'employer', labelKey: 'role_employer', icon: <Briefcase className="w-4 h-4" /> },
  { role: 'trainee', labelKey: 'role_trainee', icon: <Smartphone className="w-4 h-4" /> },
  { role: 'simulators', labelKey: 'role_simulators', icon: <Bot className="w-4 h-4" />, variant: 'emerald' },
];
