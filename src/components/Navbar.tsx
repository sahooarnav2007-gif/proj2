'use client';

import React from 'react';
import { Role, Language } from '@/types';
import { translations } from '@/lib/utils';
import { RoleTab, ROLE_TAB_CONFIG } from './RoleTab';
import { 
  ShieldCheck, 
  Languages, 
  FileSpreadsheet,
  Award
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  currentLanguage,
  setCurrentLanguage,
  onOpenExportModal
}) => {
  const t = translations[currentLanguage];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Top Government Branding Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase">
            Govt. of Maharashtra
          </span>
          <span className="hidden sm:inline opacity-90">
            {t.govOrg}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-[11px]">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold">{t.sihBadge}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-700/80 px-2 py-0.5 rounded text-[11px]">
            <ShieldCheck className="w-3 h-3" />
            <span>DPDP 2023 Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Skill<span className="text-orange-600 dark:text-orange-400">Sync</span>
                </span>
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                  v2.6 • MH Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {ROLE_TAB_CONFIG.map((tab) => (
              <RoleTab
                key={tab.role}
                role={tab.role}
                label={t[tab.labelKey as keyof typeof t]}
                icon={tab.icon}
                isActive={currentRole === tab.role}
                onClick={() => setCurrentRole(tab.role)}
                variant={tab.variant}
              />
            ))}
          </div>

          {/* Language Selector & Audit Export */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
              <Languages className="w-3.5 h-3.5 ml-2 text-slate-500" />
              <button
                onClick={() => setCurrentLanguage('en')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentLanguage === 'en'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setCurrentLanguage('mr')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentLanguage === 'mr'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setCurrentLanguage('hi')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentLanguage === 'hi'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Export Audit Report */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm"
              title="Export Government Audit Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Audit Report</span>
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher Scroll */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {ROLE_TAB_CONFIG.map((tab) => (
            <button
              key={tab.role}
              onClick={() => setCurrentRole(tab.role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
                currentRole === tab.role
                  ? tab.variant === 'emerald'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-orange-600 text-white font-bold'
                  : tab.variant === 'emerald'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.icon}
              <span>{t[tab.labelKey as keyof typeof t]}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
