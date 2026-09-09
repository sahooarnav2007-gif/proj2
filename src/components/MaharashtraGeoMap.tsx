'use client';

import React, { useState } from 'react';
import { DistrictMetric } from '@/types';
import { formatINR, formatPercent } from '@/lib/utils';
import { MapPin, Building2, TrendingUp, ShieldAlert, Award, ArrowUpRight, Filter } from 'lucide-react';

interface MaharashtraGeoMapProps {
  districts: DistrictMetric[];
  onSelectDistrict: (districtName: string) => void;
}

// Coordinate & layout mapping for Maharashtra 36 districts grouped by Administrative Division
interface GeoNode {
  name: string;
  division: 'Konkan' | 'Pune' | 'Nashik' | 'Aurangabad' | 'Nagpur' | 'Amravati';
  x: number; // percentage in SVG coordinate plane
  y: number;
  midcCluster: string;
  isTribalAspirational?: boolean;
}

const DISTRICT_GEO_COORDS: GeoNode[] = [
  // Konkan Division (West Coast)
  { name: 'Mumbai City', division: 'Konkan', x: 18, y: 46, midcCluster: 'BFSI & Port Logistics' },
  { name: 'Mumbai Suburban', division: 'Konkan', x: 20, y: 42, midcCluster: 'ITeS, Media & Cloud' },
  { name: 'Thane', division: 'Konkan', x: 24, y: 39, midcCluster: 'Thane-Belapur Chemical & IT' },
  { name: 'Palghar', division: 'Konkan', x: 21, y: 30, midcCluster: 'Tarapur Chemical MIDC', isTribalAspirational: true },
  { name: 'Raigad', division: 'Konkan', x: 23, y: 54, midcCluster: 'Taloja & Roha Industrial Corridor' },
  { name: 'Ratnagiri', division: 'Konkan', x: 24, y: 68, midcCluster: 'Marine Processing & Petrochemicals' },
  { name: 'Sindhudurg', division: 'Konkan', x: 26, y: 82, midcCluster: 'Agro-Food & Eco-Tourism' },

  // Nashik Division (North-West)
  { name: 'Nashik', division: 'Nashik', x: 34, y: 32, midcCluster: 'Satpur & Ambad Auto & Electricals' },
  { name: 'Dhule', division: 'Nashik', x: 38, y: 20, midcCluster: 'Textile Hub & Solar Park' },
  { name: 'Nandurbar', division: 'Nashik', x: 32, y: 14, midcCluster: 'Aspirational Tribal Livelihoods', isTribalAspirational: true },
  { name: 'Jalgaon', division: 'Nashik', x: 48, y: 22, midcCluster: 'Drip Irrigation & Agro-Machinery' },
  { name: 'Ahmednagar', division: 'Nashik', x: 37, y: 48, midcCluster: 'Sugar Agro & Automotive Ancillary' },

  // Pune Division (South-West)
  { name: 'Pune', division: 'Pune', x: 33, y: 58, midcCluster: 'Chakan-Talegaon Auto & EV Corridor' },
  { name: 'Satara', division: 'Pune', x: 34, y: 70, midcCluster: 'Precision Engineering & Sugar' },
  { name: 'Solapur', division: 'Pune', x: 50, y: 68, midcCluster: 'Textiles, Garments & Solar Cluster' },
  { name: 'Kolhapur', division: 'Pune', x: 32, y: 82, midcCluster: 'Foundry, Forging & Automotive' },
  { name: 'Sangli', division: 'Pune', x: 39, y: 79, midcCluster: 'Agro-Processing, Turmeric & Heavy Foundries' },

  // Aurangabad (Chhatrapati Sambhaji Nagar) Division (Central Marathwada)
  { name: 'Chhatrapati Sambhaji Nagar', division: 'Aurangabad', x: 46, y: 39, midcCluster: 'Waluj & Shendra DMIC 5-Axis CNC' },
  { name: 'Jalna', division: 'Aurangabad', x: 53, y: 38, midcCluster: 'Steel Rolling & Hybrid Seeds Hub' },
  { name: 'Beed', division: 'Aurangabad', x: 50, y: 50, midcCluster: 'Rural Dairy & Renewable Energy' },
  { name: 'Dharashiv', division: 'Aurangabad', x: 55, y: 60, midcCluster: 'Solapur-Dharashiv Solar Belt' },
  { name: 'Nanded', division: 'Aurangabad', x: 67, y: 48, midcCluster: 'Cotton Processing & Phrama MIDC' },
  { name: 'Parbhani', division: 'Aurangabad', x: 60, y: 44, midcCluster: 'Gin-Press Textile Processing' },
  { name: 'Hingoli', division: 'Aurangabad', x: 64, y: 36, midcCluster: 'Hingoli Agro-Processing', isTribalAspirational: true },
  { name: 'Latur', division: 'Aurangabad', x: 61, y: 58, midcCluster: 'Railway Coach Factory & Pulses Hub' },

  // Amravati Division (West Vidarbha)
  { name: 'Amravati', division: 'Amravati', x: 66, y: 24, midcCluster: 'Nandgaon Peth Mega Textile Park' },
  { name: 'Akola', division: 'Amravati', x: 58, y: 27, midcCluster: 'Cotton Oil Mills & Pulse Milling' },
  { name: 'Buldhana', division: 'Amravati', x: 52, y: 28, midcCluster: 'Malkapur Mechanical & Auto' },
  { name: 'Yavatmal', division: 'Amravati', x: 69, y: 36, midcCluster: 'Textile Ginning & Mining Ancillary' },
  { name: 'Washim', division: 'Amravati', x: 60, y: 33, midcCluster: 'Aspirational District Agro Hub', isTribalAspirational: true },

  // Nagpur Division (East Vidarbha)
  { name: 'Nagpur', division: 'Nagpur', x: 77, y: 20, midcCluster: 'MIHAN Multi-modal SEZ & Butibori' },
  { name: 'Wardha', division: 'Nagpur', x: 73, y: 28, midcCluster: 'Wardha Steel & Cotton Hub' },
  { name: 'Bhandara', division: 'Nagpur', x: 84, y: 21, midcCluster: 'Brass Metalwork & Ferro-alloys' },
  { name: 'Gondia', division: 'Nagpur', x: 89, y: 19, midcCluster: 'Rice Milling & Forest Logistics', isTribalAspirational: true },
  { name: 'Chandrapur', division: 'Nagpur', x: 77, y: 42, midcCluster: 'Coal, Cement & Heavy Metallurgy' },
  { name: 'Gadchiroli', division: 'Nagpur', x: 86, y: 44, midcCluster: 'Aspirational Tribal Forest Produce & Steel', isTribalAspirational: true }
];

export const MaharashtraGeoMap: React.FC<MaharashtraGeoMapProps> = ({
  districts,
  onSelectDistrict
}) => {
  const [activeDivision, setActiveDivision] = useState<string>('All');
  const [hoveredNode, setHoveredNode] = useState<{ node: GeoNode; metric?: DistrictMetric } | null>(null);
  const [selectedNode, setSelectedNode] = useState<GeoNode | null>(null);

  // Map metric to district name
  const districtMetricsMap = React.useMemo(() => {
    const map = new Map<string, DistrictMetric>();
    districts.forEach(d => map.set(d.district.toLowerCase(), d));
    return map;
  }, [districts]);

  const filteredNodes = React.useMemo(() => {
    if (activeDivision === 'All') return DISTRICT_GEO_COORDS;
    return DISTRICT_GEO_COORDS.filter(n => n.division === activeDivision);
  }, [activeDivision]);

  // Color helper based on retention rate
  const getNodeColor = (retentionRate: number = 70) => {
    if (retentionRate >= 78) return { fill: '#10b981', ring: 'ring-emerald-400', label: 'High Retention (Tier 1)' };
    if (retentionRate >= 68) return { fill: '#f59e0b', ring: 'ring-amber-400', label: 'Moderate Retention' };
    return { fill: '#ef4444', ring: 'ring-rose-400', label: 'High Attrition Alert Pocket' };
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Division Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-bold uppercase rounded-md">
              GIS Geo-Spatial Intelligence
            </span>
            <span className="text-slate-400 text-xs">
              Maharashtra 36-District Longitudinal Map
            </span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>District Retention & MIDC Industrial Cluster Visualizer</span>
          </h3>
        </div>

        {/* Division Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Konkan', 'Pune', 'Nashik', 'Aurangabad', 'Amravati', 'Nagpur'].map(div => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeDivision === div
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {div === 'All' ? 'All Divisions (6)' : div}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Visual Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Interactive Geo Canvas */}
        <div className="lg:col-span-8 bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 relative min-h-[440px] flex items-center justify-center">
          
          {/* Schematic SVG Map Boundary Outline of Maharashtra */}
          <svg className="w-full h-[400px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ambient Grid Lines */}
            <line x1="10" y1="20" x2="90" y2="20" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="10" y1="80" x2="90" y2="80" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="30" y1="10" x2="30" y2="90" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1 1" />
            <line x1="60" y1="10" x2="60" y2="90" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1 1" />

            {/* Stylized Maharashtra State Boundary Path */}
            <path
              d="M 16 46 Q 18 30, 24 22 Q 34 12, 48 14 Q 65 14, 76 16 Q 88 15, 92 22 Q 91 35, 86 50 Q 82 62, 74 65 Q 64 68, 55 64 Q 45 72, 38 84 Q 30 86, 26 78 Q 22 66, 18 52 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
              strokeDasharray="2 1"
            />

            {/* Industrial Corridors Connecting Lines */}
            {/* Pune - Mumbai - Nashik Golden Triangle */}
            <line x1="20" y1="42" x2="33" y2="58" stroke="#ea580c" strokeWidth="0.6" opacity="0.6" />
            <line x1="33" y1="58" x2="34" y2="32" stroke="#ea580c" strokeWidth="0.6" opacity="0.6" />
            <line x1="34" y1="32" x2="20" y2="42" stroke="#ea580c" strokeWidth="0.6" opacity="0.6" />
            {/* Samruddhi Mahamarg Corridor: Mumbai -> Nagpur */}
            <line x1="20" y1="42" x2="46" y2="39" stroke="#3b82f6" strokeWidth="0.6" opacity="0.5" strokeDasharray="1 1" />
            <line x1="46" y1="39" x2="77" y2="20" stroke="#3b82f6" strokeWidth="0.6" opacity="0.5" strokeDasharray="1 1" />

            {/* Render Geo District Nodes */}
            {filteredNodes.map((node) => {
              const metric = districtMetricsMap.get(node.name.toLowerCase());
              const retention = metric ? metric.placedAt6M : 72;
              const colorInfo = getNodeColor(retention);
              const isHovered = hoveredNode?.node.name === node.name;
              const isSelected = selectedNode?.name === node.name;

              return (
                <g 
                  key={node.name}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredNode({ node, metric })}
                  onClick={() => {
                    setSelectedNode(node);
                    onSelectDistrict(node.name);
                  }}
                >
                  {/* Outer animated halo for hovered/tribal */}
                  {(isHovered || isSelected || node.isTribalAspirational) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 4.5 : 3.5}
                      fill={colorInfo.fill}
                      opacity={0.3}
                      className="animate-ping"
                    />
                  )}

                  {/* Main Node Point */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 3.0 : isSelected ? 2.8 : 2.0}
                    fill={colorInfo.fill}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 0.8 : 0.4}
                  />

                  {/* District Abbreviation Label */}
                  <text
                    x={node.x}
                    y={node.y - 3.2}
                    textAnchor="middle"
                    fill={isHovered ? '#ea580c' : '#94a3b8'}
                    fontSize={isHovered ? 3.2 : 2.2}
                    fontWeight={isHovered ? 'bold' : '600'}
                    className="select-none pointer-events-none"
                  >
                    {node.name.length > 10 ? node.name.substring(0, 7) + '..' : node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Legend (Bottom Left) */}
          <div className="absolute bottom-3 left-4 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl backdrop-blur-md text-[11px] space-y-1.5 shadow-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retention Status</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">High Retention (&gt;75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Moderate (68-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-300">High Churn / Tribal Pocket</span>
            </div>
          </div>
        </div>

        {/* District Detail Diagnostic Sidebar */}
        <div className="lg:col-span-4 bg-slate-950/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between h-full min-h-[440px]">
          {hoveredNode || selectedNode ? (
            (() => {
              const active = hoveredNode?.node || selectedNode!;
              const metric = hoveredNode?.metric || districtMetricsMap.get(active.name.toLowerCase());

              return (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded text-[10px] font-bold uppercase">
                        {active.division} Division
                      </span>
                      {active.isTribalAspirational && (
                        <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded text-[10px] font-bold">
                          Aspirational District
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-black text-white mt-1">{active.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>{active.midcCluster}</span>
                    </p>
                  </div>

                  {metric ? (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400">Total Trained (Cohort):</span>
                        <span className="font-mono font-bold text-white">{metric.totalTrained.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400">6-Month Verified Retention:</span>
                        <span className="font-mono font-bold text-emerald-400">{formatPercent(metric.placedAt6M)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400">Average Wage Multiplier:</span>
                        <span className="font-mono font-bold text-orange-400">{metric.wageMultiplier}x</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400">Average Current Wage:</span>
                        <span className="font-mono font-bold text-white">{formatINR(metric.avgCurrentSalary)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400">Triangulation Trust Index:</span>
                        <span className="font-mono font-bold text-blue-400">{formatPercent(metric.triangulatedTrustAvg)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg">
                        <span className="text-slate-400">Active ITIs & TPs:</span>
                        <span className="font-mono font-bold text-white">{metric.activeTPCount} Centers</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Aggregating real-time telemetry from DSDC servers...</p>
                  )}

                  <button
                    onClick={() => onSelectDistrict(active.name)}
                    className="w-full mt-3 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <span>View District Telemetry Roster</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })()
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full p-4 text-slate-500 space-y-2">
              <MapPin className="w-10 h-10 text-slate-700 animate-bounce" />
              <div className="font-bold text-slate-400 text-sm">Hover or Click Any District</div>
              <p className="text-xs text-slate-500">
                Explore real-time retention curves, MIDC industrial hubs, and wage multipliers across Maharashtra.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
            <span>MSIS Geospatial Engine</span>
            <span className="text-emerald-400 font-mono">● LIVE 36 Districts</span>
          </div>
        </div>

      </div>
    </div>
  );
};
