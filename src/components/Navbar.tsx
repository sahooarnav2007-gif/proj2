'use client';

import React, { useState } from 'react';
import { Role, Language } from '@/types';
import { translations } from '@/lib/utils';
import { 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Smartphone, 
  FileDown, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Landmark,
  Eye,
  Type,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  onOpenExportModal: () => void;
  onOpenLiveMobileQR?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  currentLanguage,
  setCurrentLanguage,
  onOpenExportModal,
  onOpenLiveMobileQR
}) => {
  const t = translations[currentLanguage];
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark' || (!savedTheme && document.documentElement.classList.contains('dark'));
      if (isDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleFontChange = (scale: 'normal' | 'large' | 'larger') => {
    setFontSizeScale(scale);
    if (scale === 'normal') document.documentElement.style.fontSize = '100%';
    if (scale === 'large') document.documentElement.style.fontSize = '108%';
    if (scale === 'larger') document.documentElement.style.fontSize = '116%';
  };

  const navItems = [
    { id: 'state_admin' as Role, label: t.role_state, icon: Landmark, badge: 'DSDC Executive' },
    { id: 'training_provider' as Role, label: t.role_tp, icon: GraduationCap, badge: 'ITI / TP Cadence' },
    { id: 'employer' as Role, label: t.role_employer, icon: Briefcase, badge: '1-Click HRMS' },
    { id: 'trainee' as Role, label: t.role_trainee, icon: Users, badge: 'PWA & DPDP' },
    { id: 'simulators' as Role, label: t.role_simulators, icon: Smartphone, badge: 'WhatsApp / IVR' },
    { id: 'ai_studio' as Role, label: t.role_ai, icon: Cpu, badge: 'ML & NLP Core' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      
      {/* 1. Official National Tricolor Top Bar & Accessibility Header */}
      <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800">
        {/* Tricolor Ribbon */}
        <div className="h-1 w-full flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-[#FFFFFF]"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: State Identity & Mantralaya Location */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              महाराष्ट्र शासन • Government of Maharashtra
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Department of Skills, Employment, Entrepreneurship & Innovation (DSEEI)
            </span>
          </div>

          {/* Right: National Accessibility Controls & Language Switcher */}
          <div className="flex items-center gap-3">
            {/* Font Size Adjuster (GIGW Standard) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Text:</span>
              <button 
                onClick={() => handleFontChange('normal')}
                className={`px-1 rounded text-[11px] font-bold ${fontSizeScale === 'normal' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Default Font Size"
              >
                A-
              </button>
              <button 
                onClick={() => handleFontChange('large')}
                className={`px-1 rounded text-[11px] font-bold ${fontSizeScale === 'large' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Large Font Size"
              >
                A
              </button>
              <button 
                onClick={() => handleFontChange('larger')}
                className={`px-1 rounded text-[11px] font-bold ${fontSizeScale === 'larger' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Extra Large Font Size"
              >
                A+
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-orange-400 mr-1" />
              {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                    currentLanguage === lang
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'ENG' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                </button>
              ))}
            </div>

            {/* Top Bar Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 text-[11px] font-bold transition cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
              <span className="hidden sm:inline">{isDarkMode ? "Light" : "Dark"}</span>
            </button>

            {/* Hackathon Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-orange-950/80 text-orange-300 border border-orange-700/50 rounded font-mono text-[10px]">
              <span>SIH-2026: PS SIH26135</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-600 to-slate-900 text-white rounded-xl shadow-md flex items-center justify-center">
              <Landmark className="w-7 h-7 text-orange-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                  {t.appTitle}
                </h1>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  MSIS Portal
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  DPDP Act 2023
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1">
                {t.tagline} • <span className="text-slate-500 font-normal">State Innovation Society (MSIS)</span>
              </p>
            </div>
          </div>

          {/* Right Actions: Live Phone QR Demo, Theme Toggle & Legislative DSDC Audit Export Dossier */}
          <div className="flex items-center gap-2">
            {/* Prominent Dark/Light Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <span className="hidden md:inline text-amber-400">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span className="hidden md:inline text-slate-700">Dark</span>
                </>
              )}
            </button>

            {onOpenLiveMobileQR && (
              <button
                onClick={onOpenLiveMobileQR}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                title="Let judges scan QR code with their phone to test live real-time sync"
              >
                <Smartphone className="w-4 h-4 text-white animate-bounce" />
                <span className="hidden sm:inline">📱 Scan-on-Phone Live QR Demo</span>
                <span className="sm:hidden">Live QR</span>
              </button>
            )}

            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 border border-slate-700"
              title="Download official state legislative compliance dossier in CSV/PDF format"
            >
              <FileDown className="w-4 h-4 text-orange-400 dark:text-white" />
              <span className="hidden sm:inline">Export DSDC Audit Dossier</span>
              <span className="sm:hidden">Audit CSV</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Role Navigation Tabs (State, ITI/TP, Employer, Trainee, Simulators, AI) */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5" aria-label="Portal Roles">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRole(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span className={`hidden md:inline text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive 
                      ? 'bg-orange-700/80 text-orange-100' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
};
