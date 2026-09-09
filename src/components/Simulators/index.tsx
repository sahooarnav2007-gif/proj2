'use client';

import React, { useState } from 'react';
import { WhatsAppBotSimulator } from './WhatsAppBotSimulator';
import { IVRSimulator } from './IVRSimulator';
import { USSDSimulator } from './USSDSimulator';
import { StressTestBench } from '../StressTestBench';
import { EPFOVerificationSandbox } from './EPFOVerificationSandbox';
import { 
  MessageSquare, 
  PhoneCall, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const SimulatorsContainer: React.FC<{ onOutcomeSubmitted?: (data: any) => void }> = ({ onOutcomeSubmitted }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'ivr' | 'ussd' | 'stress' | 'epfo'>('whatsapp');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Selector Tabs Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black">Multi-Channel Follow-Up & Scalability Simulators</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how Skill Sync delivers 94%+ longitudinal continuity across 50k youth, 2G keypad phones, and urban WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs gap-1">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>1. WhatsApp Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('ivr')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'ivr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>2. Marathi IVR Voice</span>
          </button>

          <button
            onClick={() => setActiveTab('ussd')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'ussd' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>3. Retro 2G USSD (*342#)</span>
          </button>

          <button
            onClick={() => setActiveTab('stress')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'stress' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4. 50k Stress-Test</span>
          </button>

          <button
            onClick={() => setActiveTab('epfo')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'epfo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>5. EPFO Sandbox</span>
          </button>
        </div>
      </div>

      {/* Render Selected Simulator */}
      {activeTab === 'whatsapp' && <WhatsAppBotSimulator onOutcomeSubmitted={onOutcomeSubmitted} />}
      {activeTab === 'ivr' && <IVRSimulator />}
      {activeTab === 'ussd' && <USSDSimulator onOutcomeSubmitted={onOutcomeSubmitted} />}
      {activeTab === 'stress' && <StressTestBench />}
      {activeTab === 'epfo' && <EPFOVerificationSandbox />}
    </div>
  );
};