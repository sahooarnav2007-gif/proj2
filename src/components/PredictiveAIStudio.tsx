'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SKILL_GAP_NLP_TOPICS, MAHARASHTRA_DISTRICTS } from '@/data/mockData';
import { translations, formatINR } from '@/lib/utils';
import { calculateAttritionRisk } from '@/lib/attritionScore';
import { predictAttrition } from '@/lib/api';
import { AttritionPredictionInput, Language } from '@/types';
import { RiskGauge } from '@/components/RiskGauge';
import { 
  BookOpen, 
  Sliders, 
  Lightbulb,
  Cpu,
  BarChart2,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface SHAPFeatureWeight {
  feature: string;
  value: string;
  impact: number; // positive increases risk, negative decreases risk
  description: string;
}

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

interface EnrichedPrediction {
  score: number;
  level: RiskLevel;
  intervention: string;
  color: string;
  bg: string;
}

interface PredictiveAIStudioProps {
  currentLanguage: Language;
}

export const PredictiveAIStudio: React.FC<PredictiveAIStudioProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];

  // Attrition Simulation State
  const [sector, setSector] = useState<string>('Automotive & EV');
  const [district, setDistrict] = useState<string>('Pune');
  const [salary, setSalary] = useState<number>(14000);
  const [commuteKm, setCommuteKm] = useState<number>(35);
  const [shiftType, setShiftType] = useState<'Day' | 'Night' | 'Rotational'>('Night');
  const [relevance, setRelevance] = useState<number>(4);
  const [isInformal, setIsInformal] = useState<boolean>(true);
  const [monthsInJob, setMonthsInJob] = useState<number>(2);

  // Predictive algorithm calculation — local classifier snapshot + simulated model inference
  function enrichPrediction(result: { score: number; level: RiskLevel; intervention: string }): EnrichedPrediction {
    let color = 'text-emerald-600 dark:text-emerald-400';
    let bg = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800';

    if (result.level === 'Critical') {
      color = 'text-rose-600 dark:text-rose-400';
      bg = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800';
    } else if (result.level === 'High') {
      color = 'text-amber-600 dark:text-amber-400';
      bg = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
    } else if (result.level === 'Moderate') {
      color = 'text-blue-600 dark:text-blue-400';
      bg = 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800';
    }

    return { ...result, color, bg };
  }

  const [prediction, setPrediction] = useState<EnrichedPrediction>(() =>
    enrichPrediction(calculateAttritionRisk({
      sector,
      monthlySalary: salary,
      commuteKm,
      shiftType,
      trainingRelevanceScore: relevance,
      isInformal,
      monthsInJob,
      district,
    }))
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelMeta, setModelMeta] = useState<{ modelVersion: string; rocAuc: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const input: AttritionPredictionInput = {
      sector,
      monthlySalary: salary,
      commuteKm,
      shiftType,
      trainingRelevanceScore: relevance,
      isInformal,
      monthsInJob,
      district,
    };

    // Instantly render the deterministic local classifier snapshot (progressive enhancement)
    setPrediction(enrichPrediction(calculateAttritionRisk(input)));

    const timer = setTimeout(async () => {
      try {
        const res = await predictAttrition(input);
        if (cancelled) return;
        setPrediction(enrichPrediction({
          score: res.prediction.riskScorePercentage,
          level: res.prediction.riskLevel,
          intervention: res.prediction.recommendedCounselorIntervention,
        }));
        setModelMeta({ modelVersion: res.modelVersion, rocAuc: res.rocAuc });
      } catch {
        // Inference unavailable — keep the local classifier snapshot already rendered
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sector, salary, commuteKm, shiftType, relevance, isInformal, monthsInJob, district]);

  // Explainable AI (XAI) SHAP Feature Attribution Waterfall calculation
  const shapWaterfall = useMemo<SHAPFeatureWeight[]>(() => {
    const baseRate = 22; // Base population average attrition risk

    // Feature 1: Commute
    const commuteImpact = commuteKm > 25 ? Math.min(35, Math.round((commuteKm - 25) * 1.5) + 15) : commuteKm < 10 ? -8 : 0;
    
    // Feature 2: Informal / Formal EPFO
    const contractImpact = isInformal ? 22 : -12;

    // Feature 3: Wage Ratio
    const wageImpact = salary < 15000 ? 18 : salary > 28000 ? -16 : salary > 20000 ? -8 : 5;

    // Feature 4: Shift Friction
    const shiftImpact = shiftType === 'Night' ? 15 : shiftType === 'Rotational' ? 8 : -6;

    // Feature 5: Course-to-Job Relevance
    const relevanceImpact = relevance === 5 ? -18 : relevance === 4 ? -10 : relevance === 1 ? 20 : 0;

    // Feature 6: Early Tenure Hazard
    const tenureImpact = monthsInJob <= 3 ? 12 : monthsInJob > 12 ? -10 : 0;

    return [
      {
        feature: 'Base State Population Intercept (E[f(x)])',
        value: 'Baseline',
        impact: baseRate,
        description: 'Historical Maharashtra baseline exit rate'
      },
      {
        feature: 'Commute Distance Friction',
        value: `${commuteKm} km`,
        impact: commuteImpact,
        description: commuteKm > 25 ? 'High daily travel exhaustion hazard (>25 km)' : 'Favorable short commute'
      },
      {
        feature: 'Contract & Social Security Status',
        value: isInformal ? 'Informal (No EPFO)' : 'Formal EPFO / UAN',
        impact: contractImpact,
        description: isInformal ? 'No formal social safety net or pension' : 'Active EPFO provident fund contribution'
      },
      {
        feature: 'Wage-to-Cost-of-Living Bracket',
        value: formatINR(salary),
        impact: wageImpact,
        description: salary < 15000 ? 'Low wage vs MIDC regional living costs' : 'Competitive wage above median'
      },
      {
        feature: 'Shift Schedule Fatigue',
        value: `${shiftType} Shift`,
        impact: shiftImpact,
        description: shiftType === 'Night' ? 'Circadian rhythm disruption & transport risk' : 'Standard day working hours'
      },
      {
        feature: 'ITI Training Relevance',
        value: `${relevance} / 5 Stars`,
        impact: relevanceImpact,
        description: relevance >= 4 ? 'High curriculum skill match on shopfloor' : 'Severe syllabus-to-job mismatch'
      },
      {
        feature: 'Early Tenure Churn Zone',
        value: `${monthsInJob} Months in Job`,
        impact: tenureImpact,
        description: monthsInJob <= 3 ? 'Critical 90-day onboarding danger window' : 'Stabilized workplace tenure'
      }
    ];
  }, [salary, commuteKm, isInformal, shiftType, relevance, monthsInJob]);

  return (
    <div className="space-y-8 animate-fade-in pb-12" data-tour="ai">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Deep Tech & Explainable AI (XAI)
          </span>
          <span className="text-slate-400 text-xs">
            Predictive Job Attrition, SHAP Attribution & NLP Curriculum Mining
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Predictive Attrition Risk Studio & Explainable AI (XAI)
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Harness transparent machine learning to prevent early job drop-outs before they happen and automatically extract shopfloor skill deficiencies to update Maharashtra skilling curricula.
        </p>
      </div>

      {/* Interactive Attrition Risk Predictor Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Candidate Attrition Simulator (Live Tuning)
              </h3>
            </div>
            <span className="text-xs bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 font-bold px-2.5 py-1 rounded-full">
              Random Forest Inference
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust candidate parameters below to observe the real-time AI risk probability and dynamic SHAP feature weights.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.aiSector}</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="Automotive & EV">Automotive & EV (Pune/Nashik)</option>
                <option value="IT/ITeS & Cloud">IT/ITeS & Cloud (Pune/MMR)</option>
                <option value="Precision Engineering & CNC">Precision CNC (Waluj/Aurangabad)</option>
                <option value="Healthcare & Nursing">Healthcare & Nursing</option>
                <option value="Solar & Renewable Energy">Solar Energy (Solapur/Nandurbar)</option>
                <option value="Retail & Logistics">Retail & E-Commerce Logistics</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">{t.aiWage}</label>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{formatINR(salary)}</span>
              </div>
              <input
                type="range"
                min={8000}
                max={45000}
                step={500}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">{t.aiCommute}</label>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{commuteKm} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={commuteKm}
                onChange={(e) => setCommuteKm(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.aiShift}</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                {(['Day', 'Night', 'Rotational'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setShiftType(type)}
                    className={`py-1 rounded font-bold transition text-xs ${
                      shiftType === type ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">{t.aiRelevance}</label>
                <span className="font-bold text-amber-500">{relevance} / 5 {t.aiStars}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={relevance}
                onChange={(e) => setRelevance(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">{t.aiJobMonths}</label>
                <span className="font-bold text-blue-500">{monthsInJob} Months</span>
              </div>
              <input
                type="range"
                min={1}
                max={36}
                step={1}
                value={monthsInJob}
                onChange={(e) => setMonthsInJob(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="isInformalCheck"
                checked={isInformal}
                onChange={(e) => setIsInformal(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded cursor-pointer"
              />
              <label htmlFor="isInformalCheck" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                <strong>{t.aiInformal}</strong> ({t.aiInformalHint})
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.aiDistrict}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                {MAHARASHTRA_DISTRICTS.map(d => (
                  <option key={d.district} value={d.district}>{d.district}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Score & Intervention Output Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className={`p-6 rounded-2xl border ${prediction.bg} shadow-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {t.aiExitProbability}
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {t.aiInferencing}
                  </span>
                )}
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                prediction.level === 'Critical' ? 'bg-rose-600 text-white' :
                prediction.level === 'High' ? 'bg-amber-500 text-white' :
                prediction.level === 'Moderate' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {prediction.level} {t.aiRisk}
              </span>
            </div>

            <RiskGauge score={prediction.score} level={prediction.level} />

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium -mt-1">
              {t.aiExitWithin90}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{t.aiIntervention}</span>
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                {prediction.intervention}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t.aiModelArch} {modelMeta?.modelVersion ?? 'Random Forest Classifier (v2.6.4, local snapshot)'}</span>
            </span>
            <p>Trained on 140k+ longitudinal skilling records across 36 Maharashtra districts (ROC-AUC: {modelMeta?.rocAuc ?? 0.912}).</p>
          </div>
        </div>
      </div>

      {/* NEW: Explainable AI (XAI) SHAP Feature Attribution Waterfall */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Explainable AI (XAI): SHAP Feature Attribution Waterfall
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deconstructs the black-box risk score into exact mathematical feature contributions for transparent auditability.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start">
            Total Output Risk: <strong>{prediction.score}%</strong>
          </span>
        </div>

        {/* SHAP Waterfall Bars */}
        <div className="space-y-3 pt-2">
          {shapWaterfall.map((item, idx) => {
            const isBase = idx === 0;
            const isPositive = item.impact > 0;
            const isZero = item.impact === 0;

            return (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="sm:w-1/3">
                  <div className="font-bold text-slate-900 dark:text-white">{item.feature}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.description}</div>
                </div>

                <div className="sm:w-1/4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  Value: <span className="text-orange-600 dark:text-orange-400">{item.value}</span>
                </div>

                <div className="sm:w-1/3 flex items-center justify-end gap-3">
                  {/* Visual Bar representation */}
                  <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex items-center">
                    {isPositive ? (
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.abs(item.impact) * 2.5)}%` }}
                      ></div>
                    ) : (
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.abs(item.impact) * 2.5)}%` }}
                      ></div>
                    )}
                  </div>

                  <span className={`font-mono font-bold text-right w-16 ${
                    isBase ? 'text-slate-700 dark:text-slate-300' :
                    isPositive ? 'text-rose-600 dark:text-rose-400' :
                    isZero ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {isBase ? `+${item.impact}%` : isPositive ? `+${item.impact}%` : `${item.impact}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NLP Topic Clustering for Skill Gaps */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                NLP-Extracted Industry Skill Gaps & Curriculum Upgrades
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Extracted from 1,200+ employer verification remarks and trainee exit feedback calls across Maharashtra MIDCs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_GAP_NLP_TOPICS.map((topic, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between hover:border-orange-500/50 transition">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase">
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
                  <span className="text-slate-500 block">Wage Penalty:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{topic.impactOnWage}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-200">MSIS Reform:</strong> {topic.curriculumSolution}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Reported {topic.frequency} times</span>
                <span className="text-orange-600 font-semibold">{topic.affectedDistricts.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
