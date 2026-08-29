'use client';

import React, { useState } from 'react';
import { WhatsAppBotSimulator } from './WhatsAppBotSimulator';
import { IVRSimulator } from './IVRSimulator';
import { EPFOVerificationSandbox } from './EPFOVerificationSandbox';
import { MessageSquare, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';

export const SimulatorsContainer: React.FC<{ onOutcomeSubmitted?: (data: any) => void }> = ({ onOutcomeSubmitted }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'ivr' | 'epfo'>('whatsapp');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Selector Tabs Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black">Multi-Channel Follow-Up & Triangulation Simulators</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how Skill Sync achieves 94%+ longitudinal response continuity across rural & urban Maharashtra.
          </p>
        </div>

        <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
              activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>1. WhatsApp Conversational Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('ivr')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
              activeTab === 'ivr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>2. Marathi/Hindi AI IVR Voice</span>
          </button>

          <button
            onClick={() => setActiveTab('epfo')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
              activeTab === 'epfo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. EPFO & Udyam Sandbox</span>
          </button>
        </div>
      </div>

      {/* Render Selected Simulator */}
      {activeTab === 'whatsapp' && <WhatsAppBotSimulator onOutcomeSubmitted={onOutcomeSubmitted} />}
      {activeTab === 'ivr' && <IVRSimulator />}
      {activeTab === 'epfo' && <EPFOVerificationSandbox />}
    </div>
  );
};
