'use client';

import React from 'react';
import { Language } from '@/types';
import { translations } from '@/lib/utils';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  HelpCircle, 
  Globe, 
  Lock,
  Landmark,
  CheckCircle
} from 'lucide-react';

interface FooterProps {
  currentLanguage: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  return (
    <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Footer: Government Info & Quick Portals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Government Authority */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Landmark className="w-5 h-5 text-orange-500" />
              <span>महाराष्ट्र शासन • MSIS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Skill Sync is an official longitudinal tracking platform developed under the aegis of the Department of Skills, Employment, Entrepreneurship & Innovation, Government of Maharashtra.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-md font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Rule 7(b) Verified</span>
            </div>
          </div>

          {/* Col 2: Integrated State & National Schemes */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              State & National Missions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://pmkva.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>Pramod Mahajan Kaushalya Vikas (PMKVA)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://mykpy.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>Mukhyamantri Yuva Karya Prashikshan (MYKPY)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://mahaswayam.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>Mahaswayam Employment Exchange</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.apprenticeshipindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>National Apprenticeship (NAPS/NATS)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Triangulation Data Registries */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Triangulated Registries
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-blue-400" />
                <span>EPFO & ESIC Active Contribution Ledger</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-purple-400" />
                <span>Ministry of MSME Udyam Gateway</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>DigiLocker & APAAR Verification Protocol</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-amber-400" />
                <span>Maharashtra ITI DVET Master Database</span>
              </li>
            </ul>
          </div>

          {/* Col 4: State Grievance & Technical Info */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Grievance & State Helpdesk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>State Nodal Helpdesk: <span className="text-white font-mono font-semibold">1800-120-8040</span></p>
              <p>DSDC Secretariat: <span className="text-white">Mantralaya, Mumbai - 400032</span></p>
              <p>Official Portal: <span className="text-orange-400">kaushalya.maharashtra.gov.in</span></p>
              <div className="pt-2">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  Release v2.6.4-SIH26135
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Bar: Compliance, Copyright & GIGW Notices */}
      <div className="bg-slate-950 border-t border-slate-800/80 py-4 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © 2026 Maharashtra State Innovation Society (MSIS), Department of Skills, Employment, Entrepreneurship and Innovation, Government of Maharashtra.
          </div>
          <div className="flex items-center gap-4 text-slate-400 flex-wrap justify-center">
            <span className="hover:text-white cursor-pointer transition-colors">Aaple Sarkar Portal</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">RTI Maharashtra</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">DPDP Privacy Framework</span>
            <span>•</span>
            <span className="text-emerald-500">Hosted on NIC MeghRaj Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
