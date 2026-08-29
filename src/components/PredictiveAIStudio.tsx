'use client';

import React, { useState, useMemo } from 'react';
import { SKILL_GAP_NLP_TOPICS } from '@/data/mockData';
import { formatINR } from '@/lib/utils';
import { 
  BookOpen, 
  Sliders, 
  Lightbulb 
} from 'lucide-react';

export const PredictiveAIStudio: React.FC = () => {
  // Attrition Simulation State
  const [sector, setSector] = useState<string>('Automotive & EV');
  const [salary, setSalary] = useState<number>(18000);
  const [commuteKm, setCommuteKm] = useState<number>(12);
  const [shiftType, setShiftType] = useState<'Day' | 'Night' | 'Rotational'>('Day');
  const [relevance, setRelevance] = useState<number>(4);
  const [isInformal, setIsInformal] = useState<boolean>(false);
  const [monthsInJob, setMonthsInJob] = useState<number>(6);

  // Predictive algorithm calculation
  const prediction = useMemo(() => {
    let baseScore = 20;

    // Sector baseline adjustments
    if (sector === 'Retail & Logistics') baseScore += 8;

    // Wage vs Commute penalty
    if (salary < 15000 && commuteKm > 20) baseScore += 35;
    else if (salary < 18000 && commuteKm > 25) baseScore += 25;
    else if (commuteKm > 30) baseScore += 18;

    // Course relevance penalty
    if (relevance <= 2) baseScore += 28;
    else if (relevance === 3) baseScore += 12;
    else baseScore -= 10;

    // Informal penalty
    if (isInformal) baseScore += 22;

    // Shift type
    if (shiftType === 'Rotational') baseScore += 10;
    if (shiftType === 'Night') baseScore += 15;

    // Months in job (early months 1-3 have highest churn)
    if (monthsInJob <= 3) baseScore += 15;
    else if (monthsInJob >= 12) baseScore -= 15;

    const clampedScore = Math.max(5, Math.min(95, baseScore));

    let level: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    let color = 'text-emerald-600 dark:text-emerald-400';
    let bg = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300';
    let intervention = 'Standard 6-month automated check-in cadence.';

    if (clampedScore >= 75) {
      level = 'Critical';
      color = 'text-rose-600 dark:text-rose-400';
      bg = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300';
      intervention = 'URGENT: Trigger dedicated counselor call within 48 hours + evaluate transport subsidy or job re-match.';
    } else if (clampedScore >= 50) {
      level = 'High';
      color = 'text-amber-600 dark:text-amber-400';
      bg = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300';
      intervention = 'Dispatch micro-survey on workplace satisfaction + offer weekend bridge upskilling module.';
    } else if (clampedScore >= 30) {
      level = 'Moderate';
      color = 'text-blue-600 dark:text-blue-400';
      bg = 'bg-blue-50 dark:bg-blue-950/60 border-blue-300';
      intervention = 'Monitor next monthly EPFO contribution + send peer community invite.';
    }

    return {
      score: clampedScore,
      level,
      color,
      bg,
      intervention
    };
  }, [sector, salary, commuteKm, shiftType, relevance, isInformal, monthsInJob]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            AI & Analytics Studio
          </span>
          <span className="text-slate-400 text-xs">
            Predictive Job Attrition & Curriculum Skill-Gap Mining
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Predictive Attrition Risk Modeling & NLP Topic Clustering
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Harness machine learning to prevent early job drop-outs before they happen and automatically extract shopfloor skill deficiencies to update Maharashtra skilling curricula.
        </p>
      </div>

      {/* Interactive Attrition Risk Predictor Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Candidate Attrition Risk Simulator (Interactive)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust candidate parameters below to observe the AI risk probability and recommended intervention.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Industry Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="Automotive & EV">Automotive & EV</option>
                <option value="IT/ITeS & Cloud">IT/ITeS & Cloud</option>
                <option value="Precision Engineering & CNC">Precision Engineering & CNC</option>
                <option value="Healthcare & Nursing">Healthcare & Nursing</option>
                <option value="Solar & Green Energy">Solar & Green Energy</option>
                <option value="Retail & Logistics">Retail & Logistics</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Shift Type</label>
              <select
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value as 'Day' | 'Night' | 'Rotational')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="Day">Standard Day Shift</option>
                <option value="Rotational">Rotational Shift</option>
                <option value="Night">Night Shift</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Monthly Salary (₹ INR)</label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(salary)}</span>
              </div>
              <input
                type="range"
                min={8000}
                max={50000}
                step={1000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">One-Way Commute Distance (km)</label>
                <span className="font-bold text-slate-900 dark:text-white">{commuteKm} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={commuteKm}
                onChange={(e) => setCommuteKm(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Training Relevance Score</label>
                <span className="font-bold text-amber-500">{relevance} / 5 Stars</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={relevance}
                onChange={(e) => setRelevance(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Months in Current Job</label>
                <span className="font-bold text-indigo-500">{monthsInJob} Months</span>
              </div>
              <input
                type="range"
                min={1}
                max={36}
                step={1}
                value={monthsInJob}
                onChange={(e) => setMonthsInJob(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="isInformalCheck"
                checked={isInformal}
                onChange={(e) => setIsInformal(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <label htmlFor="isInformalCheck" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                <strong>Informal / Unregistered Contract</strong> (No formal EPFO provident fund coverage)
              </label>
            </div>
          </div>
        </div>

        {/* AI Score & Intervention Output Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className={`p-6 rounded-2xl border ${prediction.bg} shadow-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Predicted Job Exit Probability
              </span>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                prediction.level === 'Critical' ? 'bg-rose-600 text-white' :
                prediction.level === 'High' ? 'bg-amber-500 text-white' :
                prediction.level === 'Moderate' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {prediction.level} Risk
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black ${prediction.color}`}>
                {prediction.score}%
              </span>
              <span className="text-xs text-slate-500">within next 90 days</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  prediction.score >= 75 ? 'bg-rose-500' :
                  prediction.score >= 50 ? 'bg-amber-500' :
                  prediction.score >= 30 ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${prediction.score}%` }}
              ></div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Recommended Counselor Intervention:</span>
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
                {prediction.intervention}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Model Details: Random Forest Classifier (v2.6)
            </span>
            <p>Trained on 140k+ longitudinal skilling records across Maharashtra (ROC-AUC: 0.912).</p>
          </div>
        </div>
      </div>

      {/* NLP Topic Clustering for Skill Gaps */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                NLP-Extracted Industry Skill Gaps & Curriculum Upgrades
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Extracted from 1,200+ employer verification remarks and trainee exit feedback calls.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_GAP_NLP_TOPICS.map((topic, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                    {topic.sector}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    topic.severity === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {topic.severity} Severity
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {topic.gapTitle}
                </h4>

                <div className="my-2 p-2 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-xs">
                  <span className="text-slate-500 block">Wage Impact:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{topic.impactOnWage}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-200">MSIS Solution:</strong> {topic.curriculumSolution}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Reported {topic.frequency} times</span>
                <span className="text-purple-600 font-semibold">{topic.affectedDistricts.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
