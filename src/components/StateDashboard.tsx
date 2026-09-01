'use client';

import React, { useState, useMemo } from 'react';
import { Language, DistrictMetric, TrainingProviderMetric, SectorOutcome } from '@/types';
import { translations, formatINR, formatPercent } from '@/lib/utils';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Store, 
  Award, 
  MapPin, 
  Lightbulb, 
  ArrowUpRight, 
  DollarSign, 
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Line
} from 'recharts';

interface StateDashboardProps {
  currentLanguage: Language;
  districts: DistrictMetric[];
  trainingProviders: TrainingProviderMetric[];
  sectors: SectorOutcome[];
  onSelectDistrict?: (districtName: string) => void;
  onSelectTP?: (tpId: string) => void;
  onOpenAIStudio?: () => void;
}

export const StateDashboard: React.FC<StateDashboardProps> = ({
  currentLanguage,
  districts,
  trainingProviders,
  sectors,
  onSelectDistrict,
  onSelectTP,
  onOpenAIStudio
}) => {
  const t = translations[currentLanguage];

  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchDistrictQuery, setSearchDistrictQuery] = useState<string>('');

  // Aggregated statewide numbers
  const stateStats = useMemo(() => {
    const totalTrained = districts.reduce((acc, d) => acc + d.totalTrained, 0);
    const totalCertified = districts.reduce((acc, d) => acc + d.totalCertified, 0);
    const avg6M = districts.reduce((acc, d) => acc + d.placedAt6M, 0) / districts.length;
    const avg12M = districts.reduce((acc, d) => acc + d.placedAt12M, 0) / districts.length;
    const avg24M = districts.reduce((acc, d) => acc + d.placedAt24M, 0) / districts.length;
    const avgMultiplier = districts.reduce((acc, d) => acc + d.wageMultiplier, 0) / districts.length;
    const avgTrust = districts.reduce((acc, d) => acc + d.triangulatedTrustAvg, 0) / districts.length;
    const avgSelfEmp = districts.reduce((acc, d) => acc + d.selfEmploymentRate, 0) / districts.length;

    return {
      totalTrained,
      totalCertified,
      avg6M,
      avg12M,
      avg24M,
      avgMultiplier,
      avgTrust,
      avgSelfEmp
    };
  }, [districts]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter(d => {
      const matchRegion = selectedRegion === 'All' || d.region === selectedRegion;
      const matchTier = selectedTier === 'All' || d.tier === selectedTier;
      const matchSearch = d.district.toLowerCase().includes(searchDistrictQuery.toLowerCase());
      return matchRegion && matchTier && matchSearch;
    });
  }, [districts, selectedRegion, selectedTier, searchDistrictQuery]);

  // Longitudinal Retention Chart Data (Simulated 3M, 6M, 12M, 24M, 36M trend)
  const longitudinalCurveData = [
    { milestone: 'Month 3', formal: 89.4, overall: 91.2, selfEmployed: 9.2, target: 85.0 },
    { milestone: 'Month 6', formal: 78.5, overall: 84.6, selfEmployed: 14.8, target: 75.0 },
    { milestone: 'Month 12', formal: 72.1, overall: 78.4, selfEmployed: 18.2, target: 70.0 },
    { milestone: 'Month 24', formal: 66.8, overall: 73.5, selfEmployed: 21.4, target: 65.0 },
    { milestone: 'Month 36', formal: 63.4, overall: 70.2, selfEmployed: 23.0, target: 60.0 },
  ];

  // Sector Wage Multiplier Chart Data
  const sectorWageData = sectors.map(s => ({
    name: s.sector.replace(' & ', '\n& '),
    starting: s.avgStartingSalary,
    m12: s.avgSalary12M,
    m24: s.avgSalary24M,
    retention: s.retentionAt12M
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  State Policy Cockpit
                </span>
                <span className="text-slate-400 text-xs font-medium">
                  MSSDS & MSIS Longitudinal Skilling Impact
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Maharashtra State Skilling Outcomes & Longitudinal ROI
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Continuous 3-to-36 month post-training tracking triangulating Trainee self-reports, EPFO provident fund activity, and Udyam business signals across all 36 districts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAIStudio}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Open Predictive Attrition AI Studio</span>
              </button>
            </div>
          </div>

          {/* Statewide 6 Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>{t.totalTrained}</span>
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-black mt-2 text-white">
                {stateStats.totalTrained.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>91.8% Certified</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>{t.retentionRate6M}</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black mt-2 text-white">
                {formatPercent(stateStats.avg6M)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Triangulated 6-Month Post Cert
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>{t.retentionRate12M}</span>
                <TrendingUp className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black mt-2 text-white">
                {formatPercent(stateStats.avg12M)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Longitudinal 1-Year Mark
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>{t.avgWageGrowth}</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black mt-2 text-emerald-300">
                {stateStats.avgMultiplier.toFixed(2)}x
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                ₹14.5k → ₹26.8k avg hike
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>{t.triangulationTrust}</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black mt-2 text-cyan-300">
                {formatPercent(stateStats.avgTrust)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                EPFO + Employer + Bot Match
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>{t.selfEmployment}</span>
                <Store className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black mt-2 text-purple-300">
                {formatPercent(stateStats.avgSelfEmp)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Udyam & MUDRA Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Longitudinal Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Longitudinal Retention Curve (3M -> 36M) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Statewide Longitudinal Employment Retention (Month 3 to 36)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tracking cohort persistence over time vs Maharashtra State Benchmarks (Target 70% at 12M).
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              +13.4% Above National Avg
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={longitudinalCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorFormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="milestone" stroke="#64748b" fontSize={12} />
                <YAxis unit="%" domain={[40, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
                <Area type="monotone" dataKey="overall" name="Total Employed + Self-Employed" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorOverall)" />
                <Area type="monotone" dataKey="formal" name="Formal Sector (EPFO Active)" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorFormal)" />
                <Line type="monotone" dataKey="target" name="State Target Benchmark" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Wage Multiplier Growth */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Wage Progression by Sector (₹/Month)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Starting stipend vs 12-Month vs 24-Month verified earnings.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorWageData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [formatINR(Number(val))]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="starting" name="Starting Stipend" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="m12" name="12-Month Wage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="m24" name="24-Month Wage" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Policy Interventions Alert Box */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                💡 MSIS Policy Recommendations — Remedial Action Required (Q1 2026)
              </h4>
              <span className="text-xs font-semibold bg-amber-200/60 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                AI Triangulation Engine Insight
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200/50">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  1. Solapur Textile Modernization
                </span>
                Trainees from Barshi/Solapur report 42% attrition due to legacy manual loom training. Recommended: Shift budget to modern Air-jet/Rapier loom simulators.
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200/50">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                  2. EV Battery CoE Expansion in Pune
                </span>
                Highest 24-month retention (84.6%) and 1.89x wage multiplier in Auto EV courses. Recommended: Replicate Pune ITI curriculum in Nashik & Aurangabad.
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-amber-200/50">
                <span className="font-bold text-purple-800 dark:text-purple-300 block mb-1">
                  3. Gadchiroli SHG Micro-Grants
                </span>
                Tribal trainees in medicinal herbs show 31.2% self-employment success but face packaging bottlenecks. Link directly with MSRLM packaging clusters.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maharashtra District Heatmap & Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Maharashtra District-Wise Longitudinal Performance Table
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compare skilling throughput, retention at 6M/12M/24M, average wage growth, and Udyam self-employment across all 36 districts.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search district..."
              value={searchDistrictQuery}
              onChange={(e) => setSearchDistrictQuery(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Regions (6)</option>
              <option value="Konkan">Konkan</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Amravati">Amravati</option>
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Tiers</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
              <option value="Aspirational/Tribal">Aspirational / Tribal</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-3">Region & Tier</th>
                <th className="py-3 px-3 text-right">Total Trained</th>
                <th className="py-3 px-3 text-right">6M Ret.</th>
                <th className="py-3 px-3 text-right">12M Ret.</th>
                <th className="py-3 px-3 text-right">24M Ret.</th>
                <th className="py-3 px-3 text-right">Starting → Current Wage</th>
                <th className="py-3 px-3 text-right">Wage Multiplier</th>
                <th className="py-3 px-3 text-right">Self-Emp %</th>
                <th className="py-3 px-3 text-center">Trust Index</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredDistricts.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>{d.district}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-600 dark:text-slate-300 font-normal">{d.region}</span>
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      d.tier === 'Tier 1' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      d.tier === 'Tier 2' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                      d.tier === 'Aspirational/Tribal' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {d.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {d.totalTrained.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPercent(d.placedAt6M)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-teal-600 dark:text-teal-400">
                    {formatPercent(d.placedAt12M)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPercent(d.placedAt24M)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    {formatINR(d.avgInitialSalary)} → <span className="font-bold text-slate-900 dark:text-white">{formatINR(d.avgCurrentSalary)}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                    {d.wageMultiplier.toFixed(2)}x
                  </td>
                  <td className="py-3 px-3 text-right text-purple-600 dark:text-purple-400 font-semibold">
                    {formatPercent(d.selfEmploymentRate)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      {formatPercent(d.triangulatedTrustAvg)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectDistrict && onSelectDistrict(d.district)}
                      className="text-orange-600 hover:text-orange-700 dark:text-orange-400 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Drilldown</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training Provider ROI Leaderboard */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Training Provider (TP & ITI) Longitudinal ROI Scorecard
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by verified long-term job retention, wage multiplier, and multi-channel follow-up response speed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingProviders.map((tp) => (
            <div 
              key={tp.id} 
              className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-800 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    tp.status === 'A+' ? 'bg-emerald-500 text-white' :
                    tp.status === 'A' ? 'bg-blue-600 text-white' :
                    tp.status === 'B' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    Grade {tp.status}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {tp.id}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {tp.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{tp.district}, Maharashtra</span>
                </p>

                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">12M Ret.</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{tp.retentionAt12M}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Wage Hike</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{tp.avgWageHike}x</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Trust Score</span>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{tp.triangulationTrustRate}%</span>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Top Courses:</span>
                  <div className="flex flex-wrap gap-1">
                    {tp.topCourses.map((c, i) => (
                      <span key={i} className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Rating: <span className="font-bold text-amber-500">★ {tp.rating.toFixed(1)}</span>
                </span>
                <button
                  onClick={() => onSelectTP && onSelectTP(tp.id)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:underline"
                >
                  View Cohorts →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
